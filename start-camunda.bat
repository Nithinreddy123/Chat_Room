@echo off
set version="lts-5"
docker build -t 9502044626/chat-room-widget:%version% .

docker push 9502044626/chat-room-widget:%version%
putty.exe -ssh ubuntu@ec2-3-7-22-217.ap-south-1.compute.amazonaws.com -pw nithin@143 -m D:\recover\techforce\chat-room\chat-room\client\commands.txt