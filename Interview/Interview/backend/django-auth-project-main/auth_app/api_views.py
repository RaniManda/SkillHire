import json
import os
import random
import requests
from urllib.parse import urlencode
from django.http import JsonResponse
from django.contrib.auth import get_user_model, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.shortcuts import redirect
from .models import OTP

User = get_user_model()


def send_otp_email(email, otp_code):
    """Send OTP to email"""
    try:
        subject = "Your SkillHire Registration OTP"
        message = f"Your OTP for SkillHire registration is: {otp_code}\n\nThis OTP is valid for 10 minutes."
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
        return True
    except:
        return False


@csrf_exempt
def send_otp(request):
    """Send OTP to email for registration or password reset"""
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    
    data = json.loads(request.body)
    email = data.get("email")
    
    if not email:
        return JsonResponse({"error": "Email required"}, status=400)
    
    # Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    
    # Delete old OTPs for this email
    OTP.objects.filter(email=email).delete()
    
    # Create new OTP
    otp = OTP.objects.create(email=email, otp_code=otp_code)
    
    # Send email
    if send_otp_email(email, otp_code):
        return JsonResponse({"message": "OTP sent to email", "success": True}, status=200)
    else:
        otp.delete()
        return JsonResponse({"error": "Failed to send OTP"}, status=500)


@csrf_exempt
def verify_otp(request):
    """Verify OTP"""
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    
    data = json.loads(request.body)
    email = data.get("email")
    otp_code = data.get("otp")
    
    if not email or not otp_code:
        return JsonResponse({"error": "Email and OTP required"}, status=400)
    
    try:
        otp = OTP.objects.filter(email=email).latest('created_at')
    except OTP.DoesNotExist:
        return JsonResponse({"error": "OTP not found"}, status=401)
    
    if otp.is_expired():
        return JsonResponse({"error": "OTP expired"}, status=401)
    
    if otp.otp_code != otp_code:
        return JsonResponse({"error": "Invalid OTP"}, status=401)
    
    otp.is_verified = True
    otp.save()
    
    return JsonResponse({"message": "OTP verified successfully"}, status=200)


@csrf_exempt
def register_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    otp_code = data.get("otp")
    role = data.get("role", "student")

    if not username or not email or not password or not otp_code:
        return JsonResponse({"error": "All fields required"}, status=400)

    # Verify OTP
    try:
        otp = OTP.objects.filter(email=email).latest('created_at')
    except OTP.DoesNotExist:
        return JsonResponse({"error": "OTP not verified"}, status=401)
    
    if otp.is_expired():
        return JsonResponse({"error": "OTP expired"}, status=401)
    
    if not otp.is_verified:
        return JsonResponse({"error": "OTP not verified"}, status=401)
    
    if otp.otp_code != otp_code:
        return JsonResponse({"error": "Invalid OTP"}, status=401)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email exists"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.role = role
    user.save()
    
    # Delete OTP after successful registration
    otp.delete()

    return JsonResponse({"message": "Account created successfully"}, status=201)


@csrf_exempt
def login_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email and password required"}, status=400)

    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=401)

    if not user_obj.is_active:
        return JsonResponse({"error": "Account is not active"}, status=401)

    user = authenticate(username=user_obj.username, password=password)

    if not user:
        return JsonResponse({"error": "Invalid password"}, status=401)

    return JsonResponse({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }, status=200)


@csrf_exempt
def reset_password_api(request):
    """Reset password with OTP verification"""
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    
    data = json.loads(request.body)
    email = data.get("email")
    otp_code = data.get("otp")
    new_password = data.get("new_password")
    
    if not email or not otp_code or not new_password:
        return JsonResponse({"error": "Email, OTP, and password required"}, status=400)
    
    # Verify OTP
    try:
        otp = OTP.objects.filter(email=email).latest('created_at')
    except OTP.DoesNotExist:
        return JsonResponse({"error": "OTP not found"}, status=401)
    
    if otp.is_expired():
        return JsonResponse({"error": "OTP expired"}, status=401)
    
    if not otp.is_verified:
        return JsonResponse({"error": "OTP not verified"}, status=401)
    
    if otp.otp_code != otp_code:
        return JsonResponse({"error": "Invalid OTP"}, status=401)
    
    # Update password
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        
        # Delete OTP after successful reset
        otp.delete()
        
        return JsonResponse({"message": "Password reset successful"}, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=401)


@csrf_exempt
def contact_form_api(request):
    """Handle contact form submissions and email the team"""
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        data = json.loads(request.body)
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        if not all([name, email, message]):
            return JsonResponse({"error": "All fields are required"}, status=400)

        if len(message) < 10:
            return JsonResponse({"error": "Message must be at least 10 characters"}, status=400)

        recipients = getattr(settings, "CONTACT_RECIPIENTS", ["skillhire@googlegroups.com"])

        subject = f"New Contact Form Submission from {name}"
        body = (
            "New message from contact form:\n\n"
            f"Name: {name}\n"
            f"Email: {email}\n"
            f"Message: {message}\n"
        )

        # Use EmailMessage to set Reply-To header
        email_msg = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipients,
            reply_to=[email],
        )
        email_msg.send(fail_silently=False)

        return JsonResponse({
            "success": True,
            "message": "Your message has been sent to our team.",
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ⭐ CHATBOT API ENDPOINT
@csrf_exempt
def chat(request):
    """
    SkillHire Chatbot API endpoint
    Receives user message and returns AI response
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    
    try:
        data = json.loads(request.body)
        user_message = data.get("message", "").strip()
        conversation_history = data.get("history", [])  # Array of {sender, text}
        
        if not user_message:
            return JsonResponse({"error": "Message is required"}, status=400)
        
        # Get AI response with conversation context
        bot_reply = get_ai_response(user_message, conversation_history)
        
        return JsonResponse({
            "message": user_message,
            "reply": bot_reply,
            "success": True
        }, status=200)
    
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e), "success": False}, status=500)


def get_ai_response(user_message, conversation_history=[]):
    """
    Generate AI response based on user message and conversation history
    Integrates with multiple AI services: Google Gemini, OpenAI
    Falls back to context-aware keyword matching if APIs unavailable
    """
    import os
    
    # System prompt for interview preparation context
    system_context = """You are SkillHire AI, an expert interview preparation assistant. 
You help users prepare for technical interviews, system design interviews, and behavioral interviews.
You are friendly, encouraging, and provide clear, actionable advice.
When answering questions:
- Be conversational and supportive
- Provide specific examples when helpful
- Break down complex topics into simple explanations
- Encourage practice and learning
- When users ask for practice questions, provide actual questions with context"""
    
    # Get configured AI provider from settings
    ai_provider = os.getenv("CHATBOT_AI_PROVIDER", "gemini").lower()
    
    # Try the configured provider first, then fallback to others
    providers = []
    if ai_provider == "gemini":
        providers = ["gemini", "openai"]
    elif ai_provider == "openai":
        providers = ["openai", "gemini"]
    else:
        providers = ["gemini", "openai"]
    
    # Option 1: Using Google Gemini API
    if "gemini" in providers:
        try:
            import google.generativeai as genai
            
            gemini_api_key = os.getenv("GEMINI_API_KEY")
            
            if gemini_api_key and gemini_api_key.strip():
                genai.configure(api_key=gemini_api_key)
                model = genai.GenerativeModel('gemini-pro')
                
                # Build conversation context
                context = system_context + "\n\nConversation history:\n"
                for msg in conversation_history[-4:]:  # Last 4 messages for context
                    role = "User" if msg.get("sender") == "user" else "Assistant"
                    context += f"{role}: {msg.get('text', '')}\n"
                
                # Add current message
                full_prompt = f"{context}\nUser: {user_message}\n\nAssistant:"
                
                response = model.generate_content(full_prompt)
                if response and response.text:
                    print("✅ Using Gemini API")
                    return response.text
                else:
                    return "I couldn't generate a response at the moment."
        except Exception as e:
            print(f"⚠️ Gemini API Error: {e}")
    
    # Option 2: Using OpenAI API
    if "openai" in providers:
        try:
            import openai
            
            openai_api_key = os.getenv("OPENAI_API_KEY")
            
            if openai_api_key and openai_api_key.strip():
                openai.api_key = openai_api_key
                messages = [{"role": "system", "content": system_context}]
                
                # Add conversation history
                for msg in conversation_history[-4:]:
                    role = "user" if msg.get("sender") == "user" else "assistant"
                    messages.append({"role": role, "content": msg.get("text", "")})
                
                # Add current message
                messages.append({"role": "user", "content": user_message})
                
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    max_tokens=300
                )
                if response and response.choices:
                    print("✅ Using OpenAI API")
                    return response.choices[0].message.content
        except Exception as e:
            print(f"⚠️ OpenAI API Error: {e}")
    
    # Fallback: Context-aware keyword-based responses
    print("📝 Using fallback mode (Demo)")
    return get_fallback_response(user_message, conversation_history)


def get_fallback_response(message, conversation_history=[]):
    """Fallback responses when AI services are unavailable - EXACT AND SPECIFIC"""
    message_lower = message.lower().strip()
    
    # Remove common typos and variations
    message_lower = message_lower.replace("giude", "guide").replace("ti", "to").replace("u", "you").replace("okok", "ok")
    
    # Check conversation context
    context_type = None
    last_user_message = None
    if len(conversation_history) > 0:
        recent_bot_messages = [msg.get("text", "").lower() for msg in conversation_history[-3:] if msg.get("sender") == "bot"]
        recent_user_messages = [msg.get("text", "").lower() for msg in conversation_history[-3:] if msg.get("sender") == "user"]
        
        if recent_user_messages:
            last_user_message = recent_user_messages[-1]
        
        # Detect if user was asked about interview type
        if any("which one would you like to focus on" in msg or "technical interviews" in msg for msg in recent_bot_messages):
            if "hr" in message_lower or "behavioral" in message_lower:
                context_type = "hr_questions"
            elif "technical" in message_lower or "coding" in message_lower:
                context_type = "technical_questions"
            elif "system design" in message_lower or "design" in message_lower:
                context_type = "system_design_questions"
        
        # Detect if asking for practice questions
        if any("practice question" in msg for msg in recent_bot_messages) or "practice question" in message_lower:
            context_type = "practice_questions"
    
    # ============ ARRAYS & STRINGS SPECIFIC RESPONSE ============
    if "arrays & strings" in message_lower or ("array" in message_lower and "string" in message_lower):
        return """Great! Arrays & Strings are fundamental! 💪

**Key concepts you should master:**
• Arrays: Traversal, insertion, deletion, searching, sorting
• Strings: Palindromes, anagrams, pattern matching, character manipulation

**Common Interview Problems:**
1. Two Sum - Find two numbers that add up to target
2. Reverse a String - Reverse characters in-place
3. Find Duplicates - Identify duplicate elements
4. Longest Substring Without Repeating Characters
5. Valid Palindrome - Check if string is palindrome
6. Merge Sorted Arrays - Combine two sorted arrays
7. Rotate Array - Rotate array by k steps
8. Container With Most Water - Find max area

**Practice Techniques:**
• Sliding window approach
• Two pointer technique
• Hash map for frequency counting
• String manipulation tricks

Want me to explain any specific problem or technique?"""
    
    # ============ SPECIFIC PRACTICE QUESTIONS REQUEST ============
    if "practice question" in message_lower or (message_lower == "yes" and "practice" in str(conversation_history)):
        return """Perfect! Let me give you some practice problems:

**Arrays & Strings Level (Easy → Hard):**

**Easy:**
1. Reverse a string
2. Check if palindrome
3. Find duplicate in array

**Medium:**
1. Two Sum - Find pair that sums to target
2. 3Sum - Find all triplets that sum to target
3. Longest Substring Without Repeating Characters
4. Group Anagrams - Group similar word patterns

**Hard:**
1. Longest Palindromic Substring
2. Word Ladder - Shortest transformation sequence
3. Regular Expression Matching

**Which level would you like to start with?**
• Easy (fundamentals)
• Medium (interview ready)
• Hard (advanced)"""
    
    # ============ YES RESPONSE - PROVIDE MENU ============
    if message_lower in ["yes", "yeah", "yep", "ok", "okay", "okok"]:
        return """Great! Here's what I can help you with:

📝 **Technical Interviews**: Programming questions, coding challenges
🏗️ **System Design**: Architecture, scalability, databases
💬 **Behavioral Questions**: STAR method, communication skills
🧮 **DSA Practice**: Algorithms, data structures, problem-solving
📄 **Resume Tips**: Format, content, ATS optimization
💼 **Job & Internship Guidance**: Application strategy, preparation

What would you like to focus on?"""
    
    # ============ GUIDE/HELP REQUESTS ============
    if "guide" in message_lower or "help" in message_lower or "i need" in message_lower:
        return """I'd be happy to help! 🎯

**What can I assist you with?**

📚 **Interview Preparation:**
• Technical coding interviews
• System design interviews
• Behavioral/HR interviews
• Mock interview practice

💻 **DSA Mastery:**
• Arrays & Strings fundamentals
• Data structures (Trees, Graphs, LinkedLists)
• Algorithms (Sorting, DP, etc.)
• Practice problems with solutions

🎯 **Job Search:**
• Resume building tips
• Internship strategy
• Networking advice
• Company preparation

Just tell me which area interests you most!"""
    
    # Context-aware responses
    if context_type == "hr_questions" or ("hr" in message_lower and ("question" in message_lower or "practice" in message_lower)):
        return """Great! Here are 10 common HR/Behavioral interview questions to practice:

1. **Tell me about yourself**
   Focus on: Education → Experience → Current situation → Future goals

2. **What are your greatest strengths?**
   Pick 2-3 strengths relevant to the job, provide examples

3. **What is your biggest weakness?**
   Show self-awareness and improvement efforts

4. **Why do you want to work here?**
   Research the company, align with their values

5. **Where do you see yourself in 5 years?**
   Show ambition while being realistic

6. **Describe a challenging situation and how you handled it**
   Use STAR method (Situation, Task, Action, Result)

7. **Tell me about a time you worked in a team**
   Highlight collaboration and communication skills

8. **How do you handle stress and pressure?**
   Give specific coping strategies

9. **Why should we hire you?**
   Match your skills to their needs

10. **Do you have any questions for us?**
    Always prepare 2-3 thoughtful questions

Would you like me to help you prepare answers for any specific question?"""
    
    if context_type == "technical_questions" or ("technical" in message_lower and "question" in message_lower):
        return """Here are common Technical Interview questions by category:

**Arrays & Strings:**
• Two Sum problem
• Reverse a string
• Find duplicates in array
• Longest substring without repeating characters

**Data Structures:**
• Implement a stack/queue
• Detect cycle in linked list
• Binary tree traversal (inorder, preorder, postorder)
• Validate binary search tree

**Algorithms:**
• Binary search implementation
• Merge two sorted arrays
• Find the kth largest element
• Implement quicksort/mergesort

**Dynamic Programming:**
• Fibonacci sequence
• Climbing stairs problem
• Longest common subsequence
• 0/1 Knapsack problem

**Common Patterns:**
• Sliding window technique
• Two pointers approach
• Recursion and backtracking
• Hash map usage

Would you like me to explain any specific problem in detail?"""
    
    if context_type == "system_design_questions":
        return """Here are common System Design interview questions:

**Beginner Level:**
• Design a URL shortener (like bit.ly)
• Design a parking lot system
• Design a library management system

**Intermediate Level:**
• Design Instagram/Twitter
• Design a messaging app (WhatsApp)
• Design a file storage system (Dropbox)
• Design a rate limiter

**Advanced Level:**
• Design YouTube/Netflix
• Design Uber/Lyft
• Design Google Search
• Design a distributed cache

**Key Concepts to Know:**
• Load balancing
• Caching strategies
• Database sharding
• CAP theorem
• Microservices architecture
• API design
• Scalability patterns

Which system would you like to design together?"""
    
    if "practice" in message_lower and "question" in message_lower:
        return """I can provide practice questions! Which area interests you?

📝 **HR/Behavioral Questions**: Tell me about yourself, strengths/weaknesses, STAR method scenarios

💻 **Technical Coding Questions**: Arrays, strings, trees, graphs, algorithms

🏗️ **System Design Questions**: Design Twitter, URL shortener, messaging apps

🧮 **DSA Problems**: Sorting, searching, dynamic programming

Just tell me which type you'd like to practice!"""
    
    # Job/Internship/Career guidance
    career_keywords = ["job", "internship", "crack", "get hired", "placement", "career", "company", "offer"]
    if any(keyword in message_lower for keyword in career_keywords):
        if "guide" in message_lower or "help" in message_lower or "crack" in message_lower:
            return """Absolutely! I'd love to help you crack jobs and internships! 🚀

Here's your complete roadmap:

**1️⃣ Build Strong Foundations**
• Master Data Structures & Algorithms (Arrays, Trees, Graphs, DP)
• Practice coding on LeetCode, HackerRank, CodeChef
• Learn system design basics
• Build 2-3 solid projects to showcase

**2️⃣ Resume & Profile**
• Create an ATS-friendly resume (1 page for internships, 2 for jobs)
• Highlight projects with quantifiable impact
• Add relevant skills and certifications
• Build a strong LinkedIn profile and GitHub portfolio

**3️⃣ Apply Strategically**
• Target companies aligned with your skills
• Apply through referrals when possible
• Use job boards: LinkedIn, Naukri, AngelList, Wellfound
• Attend career fairs and networking events

**4️⃣ Interview Preparation**
• Technical rounds: DSA, coding challenges, system design
• HR rounds: Behavioral questions using STAR method
• Mock interviews: Practice with peers or platforms

**5️⃣ Key Tips**
• Start early (6 months before graduation)
• Network with alumni and professionals
• Contribute to open source
• Stay consistent with practice

What specific area would you like to focus on first?
• Resume building
• Interview prep
• Coding practice
• Company research"""
        
        return """Great question about jobs and internships! 🎯

I can help you with:

🎯 **Job Search Strategy**
• Where to apply and how
• Networking tips
• Company research

📝 **Application Process**
• Resume building
• Cover letter tips
• Portfolio creation

💼 **Interview Preparation**
• Technical interviews
• HR/Behavioral rounds
• Mock interview practice

🚀 **Skill Development**
• Required skills for your target role
• Learning resources
• Practice platforms

What aspect would you like to explore? Just tell me what you need help with!"""
    
    # What happened / confusion
    if message_lower in ["what happened", "what", "huh", "confused", "don't understand"]:
        return """No worries! Let me clarify. I'm here to help you with:

✅ Interview preparation (technical, behavioral, system design)
✅ Job and internship guidance
✅ Resume and career advice
✅ Coding practice and DSA
✅ Company-specific preparation

What would you like to know about? Just tell me in your own words, and I'll help! 😊"""
    
    # Greeting patterns - CASUAL & FRIENDLY
    greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
    if any(greet in message_lower for greet in greetings):
        return """Hey there! 👋 Welcome! I'm your SkillHire AI buddy!

I'm basically here to help you absolutely dominate your interviews. Whether it's coding questions, system design, behavioral prep, or just needing someone to talk to about your job search - I got you!

So, what's on your mind today? Let's make it awesome! 😊"""
    
    # Acknowledgments
    acknowledgments = ["ok", "okay", "alright", "sure", "yeah", "yep"]
    if message_lower in acknowledgments:
        return """Great! What would you like to know about? I can help with:

📝 **Technical Interviews**: Programming questions, coding challenges
🏗️ **System Design**: Architecture, scalability, databases
💬 **Behavioral Questions**: STAR method, communication skills
🧮 **DSA Practice**: Algorithms, data structures, problem-solving
📄 **Resume Tips**: Format, content, ATS optimization
💼 **Job & Internship Guidance**: Application strategy, preparation

What topic interests you most?"""
    
    # "How are you" type messages - CASUAL & FRIENDLY
    casual_greetings = ["how are you", "how are u", "whats up", "what's up", "how ya doing", "how's it going"]
    if any(phrase in message_lower for phrase in casual_greetings):
        return """Yo! I'm doing great! 😊 Thanks for asking! 

I'm here hanging out, ready to help you absolutely crush those interviews. I'm like your interview buddy, you know? 

So tell me, how are YOU doing? And more importantly, what's on your mind? Technical interview coming up? Want some practice questions? Or just vibing? 😄"""
    
    # Casual "what can you do" type messages
    if any(phrase in message_lower for phrase in ["what can you do", "what do you do", "what's your job"]):
        return """Oh, I'm basically like your personal interview coach! 🎓 Here's what I can do:

📝 **Throw Practice Questions**: Tech, behavioral, system design - all levels
🏗️ **System Design Prep**: Let's build awesome architectures together
💬 **Behavioral Coaching**: STAR method, communication tips
🧮 **DSA Help**: Solve problems, explain concepts, give hints
📄 **Resume Review**: Make it shine for recruiters
💼 **Career Guidance**: Job search strategy, internship tips
😎 **Just Chat**: Yeah, I can just vibe with you too!

What'll it be? 😊"""
    
    # Help/Guide requests - PROVIDE COMPREHENSIVE GUIDANCE DIRECTLY
    help_keywords = ["help", "guide", "assist", "support", "start", "begin", "how"]
    if any(word in message_lower for word in help_keywords):
        # Check if it's about jobs/internships
        if any(word in message_lower for word in ["job", "internship", "career", "crack", "get"]):
            return """I'd love to guide you to success! 🎯

**COMPLETE ROADMAP TO CRACK JOBS & INTERNSHIPS:**

**Phase 1: Foundation Building (3-6 months)**
• Master DSA: Arrays, Strings, Trees, Graphs, DP
• Practice on LeetCode (50-100 medium problems)
• Learn time & space complexity analysis
• Build 2-3 projects showcasing your skills

**Phase 2: Interview Preparation (2-3 months)**
• Technical interviews: Mock coding interviews
• System design: Learn scalability concepts
• Behavioral prep: Practice STAR method answers
• Resume building: ATS-optimized resume

**Phase 3: Application & Networking (1-2 months)**
• Target companies: Make a list of 50+ companies
• Apply strategically: Use job portals, referrals
• Networking: Reach out to alumni, attend events
• Mock interviews: Practice with peers/platforms

**Phase 4: Interview Rounds**
• Technical round: Coding problems, system design
• HR round: Behavioral questions, culture fit
• Final round: Often with team leads/directors

**Key Tips:**
✅ Start preparing 6 months before graduation
✅ Contribute to open source projects
✅ Build a strong GitHub portfolio
✅ Network actively on LinkedIn
✅ Maintain consistency in practice

Which phase are you in? Or which specific area do you want to focus on?"""
        
        # General guidance - COMPREHENSIVE
        return """I'd be happy to guide you! Here's your complete interview preparation guide:

**📝 TECHNICAL INTERVIEWS**
Master DSA, coding problems, algorithms
• Arrays & Strings, Trees, Graphs
• Sorting, Searching, Dynamic Programming
• Practice: LeetCode, HackerRank

**🏗️ SYSTEM DESIGN**
Build scalable systems architecture
• Load balancing, caching, databases
• Microservices, API design
• Practice: Design Twitter, YouTube, etc.

**💬 BEHAVIORAL INTERVIEWS**
Showcase your soft skills & communication
• STAR method (Situation, Task, Action, Result)
• Common questions about challenges, teamwork
• Practice: Tell your stories effectively

**🧮 DSA PRACTICE**
Strengthen problem-solving skills
• Start with Arrays & Strings
• Move to Trees, Graphs, DP
• Daily practice for 1-2 months

**📄 RESUME & PROFILE**
Make your application stand out
• ATS-friendly formatting
• Quantify achievements
• Include relevant projects & skills

**💼 JOB SEARCH STRATEGY**
Get the interview call first!
• Target companies strategically
• Use referrals & networking
• Customize for each application

Which area interests you most? I can dive deeper into any of these!"""
    
    # Interview preparation
    if "interview" in message_lower:
        if "question" in message_lower:
            return """I can provide interview questions! Which type would you like:

📝 **Technical interviews** (coding, algorithms)
🏗️ **System design interviews** (architecture, scalability)
💬 **Behavioral/HR interviews** (STAR method, soft skills)

Which one would you like to focus on?"""
        elif "technical" in message_lower or "coding" in message_lower:
            return """Technical interviews typically cover:

• Data Structures (Arrays, Trees, Graphs, Linked Lists)
• Algorithms (Sorting, Searching, Dynamic Programming)
• Problem-solving approach and code optimization
• Time & space complexity analysis

**Common Problems:**
• Array manipulation
• String operations
• Tree traversals
• Graph problems
• DP problems

Would you like me to explain any specific topic or provide practice questions?"""
        elif "behavioral" in message_lower or "hr" in message_lower:
            return """For behavioral interviews, remember the STAR method:

• **Situation**: Set the context
• **Task**: Describe the challenge
• **Action**: Explain what you did
• **Result**: Share the outcome

**Common Questions:**
1. Tell me about yourself
2. Describe a challenging situation
3. How do you handle conflicts?
4. What's your biggest weakness?
5. Why do you want to work here?

Would you like help preparing for any specific question?"""
        else:
            return """I can help you prepare for different types of interviews:

📝 **Technical interviews** (coding, algorithms)
🏗️ **System design interviews** (architecture)
💬 **Behavioral/HR interviews** (soft skills)

Which one would you like to focus on?"""
    
    # DSA topics - SPECIFIC RESPONSES
    if "dsa" in message_lower or "algorithm" in message_lower or "data structure" in message_lower:
        if "array" in message_lower or "string" in message_lower:
            return """Great! Arrays & Strings are fundamental! 💪

**Key concepts you should master:**
• Arrays: Traversal, insertion, deletion, searching, sorting
• Strings: Palindromes, anagrams, pattern matching, character manipulation

**Common Interview Problems:**
1. Two Sum - Find two numbers that add up to target
2. Reverse a String - Reverse characters in-place
3. Find Duplicates - Identify duplicate elements
4. Longest Substring Without Repeating Characters
5. Valid Palindrome - Check if string is palindrome

**Practice Techniques:**
• Sliding window approach
• Two pointer technique
• Hash map for frequency counting

Want me to explain any specific problem?"""
        
        return """DSA is crucial for technical interviews! I can help with:

• **Arrays & Strings** - Most common in interviews
• **Linked Lists** - Next pointer manipulation
• **Trees & Graphs** - Complex problem-solving
• **Sorting & Searching** - Binary search, merge sort
• **Dynamic Programming** - Optimization problems
• **Hash Maps** - Fast lookups

Which topic would you like to explore?"""
    
    # System design - SPECIFIC RESPONSE
    if "system design" in message_lower or "design system" in message_lower or "architecture" in message_lower:
        return """System Design interviews assess your ability to build scalable systems.

**Key Concepts to Learn:**
• Load Balancing - Distribute traffic
• Caching - Redis, Memcached
• Database design - SQL vs NoSQL
• Microservices - Service-oriented architecture
• API design - RESTful principles
• Scalability patterns - Sharding, replication

**Common Questions:**
• Design Twitter/Instagram
• Design URL shortener
• Design chat system
• Design file storage

What aspect would you like to discuss?"""
    
    # Resume help - SPECIFIC RESPONSE
    if "resume" in message_lower or "cv" in message_lower:
        return """Resume tips for tech interviews:

✅ **Format & Length**: Keep it 1 page (internship) or 2 pages (job)

✅ **Key Sections:**
• Header (name, email, phone, LinkedIn, GitHub)
• Professional Summary
• Technical Skills
• Experience
• Projects
• Education

✅ **Best Practices:**
• Quantify achievements (increased X by Y%)
• Use action verbs (developed, led, optimized)
• Tailor to job description
• Include relevant projects
• Check for typos

Want specific advice on any section?"""
    
    # DIRECT QUESTIONS REQUEST - PROVIDE SPECIFIC QUESTIONS
    questions_keywords = ["question", "ask", "give question", "provide question", "practice problem"]
    if any(keyword in message_lower for keyword in questions_keywords):
        # Technical questions
        if "technical" in message_lower or "coding" in message_lower or "array" in message_lower or "dsa" in message_lower:
            return """🔥 **Practice Technical Interview Questions:**

**EASY LEVEL (Start here!)**
1. **Two Sum** - Find two numbers that add up to target
2. **Reverse String** - Reverse a string in-place
3. **Palindrome Check** - Check if string is palindrome
4. **Find Duplicates** - Identify duplicate in array

**MEDIUM LEVEL (Interview ready!)**
1. **3Sum** - Find all triplets that sum to target
2. **Longest Substring** - Longest substring without repeating characters
3. **Container With Most Water** - Find maximum area between lines
4. **Word Search** - Search for word in 2D grid
5. **LRU Cache** - Implement LRU cache

**HARD LEVEL (Advanced!)**
1. **Median of Two Sorted Arrays** - Find median efficiently
2. **Regular Expression Matching** - Pattern matching algorithm
3. **Trapping Rain Water** - Calculate trapped water
4. **Edit Distance** - Minimum edits between strings

**How to solve:**
1. Understand the problem
2. Write the approach (pseudocode)
3. Code the solution
4. Test with examples
5. Optimize time/space

Which difficulty level do you want to start with?"""
        
        # Behavioral questions
        elif "behavioral" in message_lower or "hr" in message_lower:
            return """💼 **Practice Behavioral Interview Questions:**

**COMMON HR QUESTIONS:**
1. Tell me about yourself (2-3 minutes)
2. Why do you want to work here?
3. What are your strengths?
4. What is your biggest weakness?
5. Tell me about a challenging situation and how you handled it
6. Describe a time you failed and what you learned
7. How do you handle pressure and deadlines?
8. Tell me about a time you worked in a team
9. How do you stay updated with technology?
10. Where do you see yourself in 5 years?

**HOW TO ANSWER (STAR METHOD):**
• **Situation** - Set the context
• **Task** - What was your responsibility?
• **Action** - What did YOU do specifically?
• **Result** - What was the outcome? (quantify if possible)

**EXAMPLE:**
Q: "Tell me about a time you failed"
A: "In my internship (S), I was tasked with... (T). I made X mistake (A). I learned from it by... (A). The result was... (R)"

Pick any question above and practice your answer using STAR method!"""
        
        # System design questions
        elif "system design" in message_lower or "design" in message_lower:
            return """🏗️ **Practice System Design Questions:**

**BEGINNER LEVEL:**
1. Design a URL Shortener (bit.ly)
2. Design a Parking Lot System
3. Design a Library Management System

**INTERMEDIATE LEVEL:**
1. Design Twitter (with feed, tweets, followers)
2. Design Instagram (photos, filters, likes)
3. Design WhatsApp (messaging, groups)
4. Design Uber (ride matching, tracking)
5. Design Dropbox (file storage, sync)

**ADVANCED LEVEL:**
1. Design YouTube (videos, streaming, recommendations)
2. Design Netflix (content, streaming, recommendations)
3. Design Google Search (indexing, ranking)
4. Design AWS/Cloud Infrastructure

**KEY CONCEPTS TO DISCUSS:**
• Load balancing
• Caching strategies (Redis, Memcached)
• Database design (SQL vs NoSQL)
• Microservices architecture
• API endpoints
• Scalability & availability
• Failure handling

**FORMAT FOR ANSWERING:**
1. Clarify requirements
2. Estimate scale (users, requests)
3. Design architecture (components)
4. Define APIs
5. Discuss database
6. Handle failures

Which system would you like to design?"""
        
        # Job interview questions
        elif "job" in message_lower or "internship" in message_lower:
            return """💼 **Common Job/Internship Interview Questions:**

**OPENING QUESTIONS:**
1. Tell me about yourself
2. Why are you interested in this position?
3. Why do you want to work for our company?

**TECHNICAL QUESTIONS:**
1. Walk me through your recent project
2. What's the most challenging technical problem you've solved?
3. How do you approach learning new technologies?

**BEHAVIORAL QUESTIONS:**
1. Tell me about a time you had a conflict with a teammate
2. Describe a situation where you had to lead
3. How do you handle criticism?

**COMPANY-SPECIFIC:**
1. What do you know about our company?
2. What attracted you to our company?
3. How do your skills match this role?

**CLOSING QUESTIONS:**
1. Do you have any questions for us? (ALWAYS SAY YES!)
2. What's your expected salary?
3. When can you start?

**GOOD QUESTIONS TO ASK THEM:**
1. What does a typical day look like?
2. What are the biggest challenges in this role?
3. What qualities do successful employees have?
4. How is the team structured?
5. What's the growth opportunity?

Ready to practice any of these?"""
        
        # General questions
        return """🎯 **What Type of Questions Do You Need?**

Choose one:

📝 **Technical Questions**
Coding problems, algorithms, DSA (Easy, Medium, Hard)

🏗️ **System Design Questions**
Design scalable systems (URL shortener, Twitter, etc.)

💼 **Behavioral/HR Questions**
STAR method, common HR questions, how to answer

🎓 **Job Interview Questions**
Company-specific, opening/closing questions

Tell me which type, and I'll give you specific questions to practice!"""
    
    # Thanks
    if "thank" in message_lower or "thanks" in message_lower:
        return "You're very welcome! Feel free to ask anything else. Good luck with your preparation! 🚀"
    
    # Goodbye
    if "bye" in message_lower or "goodbye" in message_lower:
        return "Goodbye! Best of luck with your interviews! Remember to practice regularly. 👋"
    
    # Specific questions
    if "?" in message:
        return """That's an interesting question! Let me help you with that.

Could you provide more details about what you'd like to know? For example:
• Which interview type? (Technical/Behavioral/System Design)
• Specific topic area?
• Are you preparing for a particular company?

The more context you provide, the better I can assist you!"""
    
    # Yes/No responses to practice questions
    if message_lower == "yes":
        return """Great! What would you like to know about? I can help with:

• **Interview preparation** (technical, behavioral, system design)
• **Job and internship guidance**
• **Resume and career advice**
• **Coding practice and DSA**

Give correct reply"""
    
    # Friendship & personal connection - CASUAL & FRIENDLY
    friendship_keywords = ["friend", "be my friend", "be friends", "can we be", "wanna be", "want to be", "lets be", "let's be"]
    if any(phrase in message_lower for phrase in friendship_keywords):
        return """Oh absolutely! 😄 I'd love to be your interview buddy!

That's literally what I'm here for - to be your go-to person for interview prep. Think of me like your study companion who's always ready with:

✨ Practice questions (whenever you need)
✨ Explanations & tips
✨ Motivation when you're stressed
✨ Real talk about job hunting
✨ Someone to bounce ideas off

So yeah, we're totally friends now! 🤝 

What do you say - ready to crush some interviews together? Or just want to chat for a bit? I'm here for both! 😊"""
    
    # Casual chat/boredom handling
    bored_keywords = ["bored", "boring", "nothing to do", "wanna chat", "want to chat", "just chat", "let's chat", "lets chat"]
    if any(phrase in message_lower for phrase in bored_keywords):
        return """Yo, I feel you! 😄 But here's the thing - I'm not just any chatbot, I'm your interview prep buddy!

So let's make this productive AND fun! How about we:

🎯 **Quick brainstorm**: Tell me about a project you've worked on
🎯 **Practice question**: I'll throw a coding or behavioral question at you
🎯 **Career chat**: Where do you want to be in 5 years?
🎯 **Story time**: Tell me your biggest win or lesson learned
🎯 **Just vibing**: We can chat AND I'll throw in helpful interview tips

What sounds good? Let's make this productive yet chill! 😎"""
    
    # Thanks/gratitude handling
    thanks_keywords = ["thanks", "thank you", "thankyou", "appreciate", "much appreciated"]
    if any(phrase in message_lower for phrase in thanks_keywords):
        return """Anytime, my friend! 🙌 That's what I'm here for!

I love helping people like you prep for interviews. It gets me excited when you're making progress.

So... what's next? 🚀 Let's keep this momentum going! Tell me:
• What's your next interview?
• What topic do you want to tackle?
• Need some practice questions?

Let's crush it together! 💪"""
    
    # Encouragement/motivation requests
    encouragement_keywords = ["motivation", "encourage", "motivate", "stressed", "nervous", "scared", "worried", "confident"]
    if any(phrase in message_lower for phrase in encouragement_keywords):
        return """Listen, you've got this! 💪

Let me tell you something - the fact that you're here, preparing, asking questions? That already puts you ahead of so many people. That's the mindset of someone who wins!

**Real talk:**
✅ Every expert was once a beginner
✅ Nervousness = you care = you'll do well
✅ Preparation beats luck every single time
✅ Most interviewers want you to succeed
✅ One bad question doesn't define you

Here's what we're gonna do:
1. Identify what's making you nervous
2. Practice it together
3. Build that confidence
4. Walk into that interview like you own it

So... what's bothering you? Tech questions? Behavioral prep? Let's tackle it right now! You're gonna crush this! 🔥"""
    
    # Short responses - PROVIDE DIRECT GUIDANCE INSTEAD OF ASKING
    if len(message_lower.split()) <= 3 and "?" not in message and message_lower not in acknowledgments and message_lower not in ["yes", "yeah", "yep", "ok", "okay", "okok"]:
        # If it contains guidance keywords, provide comprehensive guidance
        if any(word in message_lower for word in ["guide", "help", "assist"]):
            return """I'd love to help! Here's your comprehensive interview preparation guide:

**📝 TECHNICAL INTERVIEWS** - Master coding & DSA
• Arrays, Strings, Trees, Graphs
• Sorting, Searching, Dynamic Programming
• Time & space complexity analysis
• Practice: LeetCode, HackerRank

**🏗️ SYSTEM DESIGN** - Build scalable systems
• Load balancing, caching strategies
• Database design (SQL vs NoSQL)
• Microservices architecture
• API design principles

**💬 BEHAVIORAL INTERVIEWS** - Ace HR rounds
• STAR method (Situation, Task, Action, Result)
• Common questions & how to answer
• Communication & teamwork examples
• Why should we hire you?

**🧮 DSA PRACTICE** - Daily problem solving
• Start with easy problems
• Progress to medium and hard
• Learn patterns and techniques
• Build confidence

**📄 RESUME TIPS** - Get noticed by recruiters
• Keep it 1-2 pages
• Quantify your achievements
• Tailor to job description
• Proofread carefully

**💼 JOB SEARCH STRATEGY** - Land the interview
• Target companies strategically
• Use networking and referrals
• Apply to multiple companies
• Follow up professionally

Which area would you like to focus on first?"""
        
        return """I'm here to help with your interview preparation! I can assist with:

• **Technical interviews** & coding
• **System design** concepts
• **Behavioral interview** strategies
• **DSA problem-solving**
• **Resume** tips
• **Job search** guidance

What specific topic would you like to explore?"""
    
    return "I'm here to help with your interview preparation! I can assist with:\n• Technical interviews & coding\n• System design concepts\n• Behavioral interview strategies\n• DSA problem-solving\n\nWhat specific topic would you like to explore?"


# ========================
# SOCIAL LOGIN (GOOGLE / LINKEDIN)
# ========================

def _safe_role(role):
    return role if role in ["student", "recruiter"] else "student"


def _build_redirect(next_url, params):
    # Ensure next_url has protocol
    if not next_url.startswith(("http://", "https://")):
        next_url = f"http://{next_url}"
    
    query = urlencode(params)
    separator = "&" if "?" in next_url else "?"
    return f"{next_url}{separator}{query}"


def _get_unique_username(base_username):
    candidate = base_username
    counter = 1
    while User.objects.filter(username=candidate).exists():
        candidate = f"{base_username}{counter}"
        counter += 1
    return candidate


@csrf_exempt
def google_oauth_start(request):
    role = _safe_role(request.GET.get("role", "student"))
    next_url = request.GET.get("next", "http://localhost:5173")

    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/oauth/google/callback/")

    if not client_id:
        return JsonResponse({"error": "Missing GOOGLE_CLIENT_ID"}, status=500)

    state = f"{role}|{next_url}"

    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "online",
        "state": state,
        "prompt": "select_account",
    }

    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return redirect(auth_url)


@csrf_exempt
def google_oauth_callback(request):
    # Check for OAuth error first
    error = request.GET.get("error")
    error_description = request.GET.get("error_description")
    
    code = request.GET.get("code")
    state = request.GET.get("state", "student|http://localhost:5173")
    
    # Safely parse state
    try:
        parts = state.split("|", 1)
        if len(parts) == 2:
            role, next_url = parts
        else:
            role = parts[0] if parts else "student"
            next_url = "http://localhost:5173"
    except (ValueError, AttributeError):
        next_url = "http://localhost:5173"
        role = "student"
    
    role = _safe_role(role)

    # Handle OAuth errors
    if error:
        return redirect(_build_redirect(next_url, {
            "oauth": "error", 
            "message": error_description or error
        }))

    if not code:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Missing code"}))

    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/oauth/google/callback/")

    if not client_id or not client_secret:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Missing Google OAuth config"}))

    token_res = requests.post("https://oauth2.googleapis.com/token", data={
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    })

    if token_res.status_code != 200:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Token exchange failed"}))

    token_data = token_res.json()
    access_token = token_data.get("access_token")

    userinfo_res = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if userinfo_res.status_code != 200:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Failed to fetch user info"}))

    userinfo = userinfo_res.json()
    email = userinfo.get("email")
    name = userinfo.get("name") or (email.split("@", 1)[0] if email else "user")

    if not email:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Email not available"}))

    username = _get_unique_username(name.replace(" ", ""))

    user, created = User.objects.get_or_create(
        email=email,
        defaults={"username": username, "role": role}
    )

    if not created and user.role != role:
        user.role = role
        user.save()

    return redirect(_build_redirect(next_url, {
        "oauth": "success",
        "provider": "google",
        "email": email,
        "username": user.username,
        "role": user.role,
    }))


@csrf_exempt
def linkedin_oauth_start(request):
    role = _safe_role(request.GET.get("role", "student"))
    next_url = request.GET.get("next", "http://localhost:5173")
    
    # Ensure next_url has protocol
    if not next_url.startswith(("http://", "https://")):
        next_url = f"http://{next_url}"

    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:8000/auth/oauth/linkedin/callback/")

    if not client_id:
        return JsonResponse({"error": "Missing LINKEDIN_CLIENT_ID"}, status=500)

    state = f"{role}|{next_url}"

    params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": "openid profile email",
        "state": state,
    }

    auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(params)}"
    return redirect(auth_url)


@csrf_exempt
def linkedin_oauth_callback(request):
    # Check for LinkedIn error first
    error = request.GET.get("error")
    error_description = request.GET.get("error_description")
    
    code = request.GET.get("code")
    state = request.GET.get("state", "student|http://localhost:5173")
    
    # Safely parse state
    try:
        parts = state.split("|", 1)
        if len(parts) == 2:
            role, next_url = parts
        else:
            role = parts[0] if parts else "student"
            next_url = "http://localhost:5173"
    except (ValueError, AttributeError):
        next_url = "http://localhost:5173"
        role = "student"
    
    role = _safe_role(role)

    # Handle LinkedIn errors
    if error:
        return redirect(_build_redirect(next_url, {
            "oauth": "error", 
            "message": error_description or error
        }))

    if not code:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Missing code"}))

    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:8000/auth/oauth/linkedin/callback/")

    if not client_id or not client_secret:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Missing LinkedIn OAuth config"}))

    token_res = requests.post("https://www.linkedin.com/oauth/v2/accessToken", data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret,
    })

    if token_res.status_code != 200:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Token exchange failed"}))

    token_data = token_res.json()
    access_token = token_data.get("access_token")

    # Use LinkedIn v2 userinfo endpoint (more reliable)
    userinfo_res = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if userinfo_res.status_code != 200:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Failed to fetch user info"}))

    userinfo = userinfo_res.json()
    
    email = userinfo.get("email")
    name = userinfo.get("name", "")
    given_name = userinfo.get("given_name", "")
    family_name = userinfo.get("family_name", "")
    
    # Build username from available info
    if not name:
        name = f"{given_name} {family_name}".strip()
    if not name and email:
        name = email.split("@")[0]

    if not email:
        return redirect(_build_redirect(next_url, {"oauth": "error", "message": "Email not available"}))

    username = _get_unique_username(name.replace(" ", ""))

    user, created = User.objects.get_or_create(
        email=email,
        defaults={"username": username, "role": role}
    )

    if not created and user.role != role:
        user.role = role
        user.save()

    return redirect(_build_redirect(next_url, {
        "oauth": "success",
        "provider": "linkedin",
        "email": email,
        "username": user.username,
        "role": user.role,
    }))