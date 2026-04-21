from django.shortcuts import render
from django.conf import settings
import subprocess
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

# Create your views here.
def index(request):
    return render(request, 'index.html')

@api_view(["GET"])
def start_parser(request):
    print("Start parcing")
    result = subprocess.run(
        [str(settings.EIS_PARSER_ROOT)+'\\.venv\Scripts\python.exe', 'parser/main.py', '1', '2', '5', "24.04.2024"],
        capture_output=True, 
        text=True,
        cwd=settings.EIS_PARSER_ROOT, #TODO: Fix cwd
    )
    if result.returncode == 0:
        with open(str(settings.EIS_PARSER_ROOT)+'/parser/art/tenders.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    return Response({'result': data}, status=200)