Commands to launch this docker on fresh installation of Raspberry

```
sudo apt-get install -y docker-compose
cd /home/<your user>/Desktop
mkdir targetx
cd targetx
wget https://github.com/Connect-IQ/OpenEnergyBox-Software/releases/download/mainv4/targetxdockerv4.zip
unzip targetxdockerv4.zip
rm targetxdockerv4.zip
docker-compose up --build -d

sudo nano /etc/systemd/system/docker-compose-app.service
```
```
[Unit]
Description=Targetx Application Service
Requires=docker.service
After=docker.service

[Service]
WorkingDirectory=/home/ciq/Desktop/targetx
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
Restart=always
User=ciq
Group=docker

[Install]
WantedBy=multi-user.target
```
```
sudo systemctl daemon-reload
sudo systemctl enable docker-compose-app.service
```
