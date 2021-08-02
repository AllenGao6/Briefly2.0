from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

@shared_task
def send_email_celery(d):
    email_subject = 'You Default Summarization Is Ready at Briefly-AI!'
    
    # {{ username }}
    # {{ mediaType }}
    # {{ mediaName }}
    # {{ collection }}
    
    plaintext = render_to_string('email.txt', d)
    htmly     = render_to_string('email.html', d)
    from_email, to = settings.EMAIL_HOST_USER, str(d['TO'])
    send_mail(
        email_subject,
        plaintext,
        from_email,
        [to],
        html_message=htmly,
        fail_silently=False
    )
    return None