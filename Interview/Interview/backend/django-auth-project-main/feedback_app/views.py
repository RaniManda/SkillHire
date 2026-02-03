from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Feedback
from .serializers import FeedbackSerializer

class TopFeedbackList(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # order by rating desc then newest
        return Feedback.objects.all().order_by('-rating', '-created_at')[:5]

class FeedbackListCreate(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

    def get_queryset(self):
        return Feedback.objects.all().order_by('-created_at')

class FeedbackRetrieveUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Feedback.objects.all()