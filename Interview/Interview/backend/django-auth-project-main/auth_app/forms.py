from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django import forms

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username','email', 'password1', 'password2')

class CustomAuthenticationForm(AuthenticationForm):
    email = forms.EmailField(required=True)

    def clean(self):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')
        if email and password:
            try:
                user = User.objects.get(email=email)
                if not user.check_password(password):
                    raise forms.ValidationError('Invalid email or password')
                self.user_cache = user
            except User.DoesNotExist:
                raise forms.ValidationError('Invalid email or password')
        return self.cleaned_data
