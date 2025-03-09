# OpenAI Conversation Tracker - WSL2 Setup & Troubleshooting Guide

Introduction

This guide details how to properly set up and troubleshoot the OpenAI Conversation Tracker backend running in WSL2 with Docker. It addresses networking issues, port forwarding, and WSL2 quirks to ensure seamless local and LAN connectivity.

1️⃣ Scheduled Task for Port Forwarding

Due to a known WSL2 port forwarding bug, create a Scheduled Task to run at startup that re-enables port forwarding.

Steps:

Open Task Scheduler (taskschd.msc).

Create a new task with:

Run with highest privileges

Trigger: At system startup

Action: Start a program (powershell.exe)

Arguments: -ExecutionPolicy Bypass -File C:\scripts\wsl_port_forward.ps1

2️⃣ Configuring Backend API Port & IP

Update server.js to bind to the correct IP for LAN access:

app.listen(PORT, "172.31.174.126", () => console.log(`🚀 Server running on port ${PORT}`));

3️⃣ WSL2 Networking & Interface Binding Fixes

If the backend is unreachable from the LAN, follow these steps to reset WSL2 networking.

✅ Restart PortProxy

Run this in an Administrator PowerShell:

net stop winnat
net start winnat

✅ Reset & Re-add Port Forwarding Rules

netsh interface portproxy reset
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=172.31.174.126

(Optionally, add an Ethernet interface forwarding rule if needed.)

Verify Rules:

netsh interface portproxy show all

Expected output:

Listen on ipv4:             Connect to ipv4:
Address         Port        Address         Port
--------------- ----------  --------------- ----------
192.168.1.34    5000        172.31.174.126  5000
192.168.1.239   5000        172.31.174.126  5000

4️⃣ Testing Backend Connectivity

Test API from Local Machine

curl -X POST http://127.0.0.1:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Hello"}'

Test API from LAN

curl -X POST "http://192.168.1.34:5000/api/chat" -H "Content-Type: application/json" -d "{\"message\": \"Hello\"}"

Check Network Interfaces

ipconfig /all

ip addr show eth0

5️⃣ Fix WSL2 Networking Issues

🔄 Restart WSL2 Networking

wsl --shutdown
netsh interface set interface "vEthernet (WSL)" admin=disable
netsh interface set interface "vEthernet (WSL)" admin=enable
wsl

🔄 Manually Fix Default Route

sudo ip route add default via 172.31.160.1 dev eth0

6️⃣ Automate Fixes with a Script

Create a PowerShell script to execute all fixes at once:

net stop winnat
net start winnat
netsh interface portproxy reset
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=172.31.174.126
wsl --shutdown
netsh interface set interface "vEthernet (WSL)" admin=disable
netsh interface set interface "vEthernet (WSL)" admin=enable
netsh interface portproxy show all
wsl

Save this as fix_wsl_networking.ps1 and run as Administrator when needed.

🔥 Final Checks & Tests

✅ Confirm API is accessible on:

Localhost (127.0.0.1:5000) ✅

LAN IP (192.168.1.34:5000) ✅

Other networked machines ✅

🚨 Troubleshooting:

If API fails, check firewall rules (netsh advfirewall firewall show rule name=all | findstr 5000)

If no response, restart WSL2 networking

If curl fails, ensure JSON is formatted correctly

🎯 Final Steps

Reboot Windows & WSL2

Retest API from multiple devices

Confirm persistent connectivity after reboot

🚀 You're in business! 🎉