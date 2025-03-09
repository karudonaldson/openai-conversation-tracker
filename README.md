# openai-conversation-tracker

Important Notes:
Due to a bug in WSL and Port Forwarding

## Add scheduled task to re-enable portforwarding at boot time

## Check proper binding is present

My buddy TK and I have lots of conversations about life, IT and AI initiatives.  And the external ChatGPT brain was born

Configure the Backend API PORT and IP to listen on by editing "line 23" of "server.js"
app.listen(PORT, "172.31.174.126", () => console.log(`🚀 Server running on port ${PORT}`));

## Express.js

Sets up the Mongodb data structure

## Troubleshooting WSL2 Networking and Interface binding

We ran into a number of Windows hiccups around the port forwarding, however, the following steps took the pain out of the process.

✅ A. Restart PortProxy with Correct Config
Run this in an elevated PowerShell terminal (Run as Administrator).

## Restart PortProxy with correct config using

```powershell
net stop winnat
net start winnat
```

## Remove and re-add port proxy rules since Windows sometimes keeps old rules active

```powershell
netsh interface portproxy reset
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=172.31.174.126
# netsh interface portproxy add v4tov4 listenaddress=192.168.1.239 listenport=5000 connectaddress=172.31.174.126 connectport=5000
```

All going to plan you should have portproxy set up from the localnet IP to inside the WSL2 container as expected

```bash
 netsh interface portproxy show all

Listen on ipv4:             Connect to ipv4:

Address         Port        Address         Port
--------------- ----------  --------------- ----------
192.168.1.34    5000        172.31.174.126  5000
192.168.1.239   5000        172.31.174.126  5000
```

## In this example, I've added a WiFi and Ethernet interface only since it was available to use

Now you should be all set to test the backend again.

## Test the backend again

```powershell
curl -X POST http://YOUR.LOCAL.NETWORK.IP:5000/api/chat -H "Content-Type: application/json" -d "{\"message\": \"Hello\"}"
```

## Failing that, restart WSL networking

```powershell
wsl --shutdown
netsh interface set interface "vEthernet (WSL)" admin=disable
netsh interface set interface "vEthernet (WSL)" admin=enable
wsl
```

## Manually fix default route

```sh
sudo ip route add default via 172.31.160.1 dev eth0
```

## Test Scripts

```powershell

net stop winnat
net start winnat
netsh interface portproxy reset
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=172.31.174.126
wsl --shutdown
netsh interface set interface "vEthernet (WSL)" admin=disable
netsh interface set interface "vEthernet (WSL)" admin=enable
netsh interface portproxy show all
wsl

```

🔥 Looking Rock Solid! 🔥

✅ Summary of Tests:
✔️ Basic API Connectivity (127.0.0.1 & LAN) - ✅ Pass
✔️ Debug Route Working - ✅ Pass
✔️ Chat API Responding on Localhost - ✅ Pass
✔️ Chat API Responding on LAN - ✅ Pass (minor JSON formatting issue)
✔️ WSL Connectivity - ✅ Pass

🚨 Minor JSON Issue in LAN Test
That last error from LAN:

SyntaxError: Unexpected token ' in JSON at position 0
💡 Cause:
Your PowerShell command may have used single quotes ('), which aren't valid for JSON strings in curl on Windows.

✅ Fix (Use Proper Escaping in PowerShell):

```powershell
curl -X POST "http://192.168.1.34:5000/api/chat" -H "Content-Type: application/json" -d "{\"message\": \"Test from LAN\"}"
```

(This ensures it's properly formatted in PowerShell.)

If you’re using CMD, this should work fine:

```cmd
curl -X POST http://192.168.1.34:5000/api/chat -H "Content-Type: application/json" -d "{\"message\": \"Test from LAN\"}"
```

🎯 Final Confirmation Steps
Restart Everything One More Time (Windows + WSL + Containers)
Re-run Tests (Just the basics)
Confirm LAN Connection Still Works
If all green, you’re in business! 🚀💥