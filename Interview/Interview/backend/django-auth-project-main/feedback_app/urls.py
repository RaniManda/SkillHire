from django.urls import path
from .views import FeedbackListCreate, FeedbackRetrieveUpdate, TopFeedbackList

urlpatterns = [
    path('', FeedbackListCreate.as_view(), name='feedback_list_create'),
    path('top/', TopFeedbackList.as_view(), name='feedback_top'),
    path('<int:pk>/', FeedbackRetrieveUpdate.as_view(), name='feedback_detail'),
]
