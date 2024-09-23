Commands to launch this docker on fresh installation of Raspberry

```
sudo apt-get install -y docker-compose
cd /home/<your user>/Desktop
mkdir targetx
cd targetx
wget https://github.com/Connect-IQ/OpenEnergyBox-Software/releases/download/main/targetxdocker.zip
unzip targetxdocker.zip
rm targetxdocker.zip
sudo docker-compose up --build -d
```
