# Gree hvac electricity price

Automation for gree hvac air condition unit

## Install & run

1. rename settings.example.json to settings.json
2. `npm run build`
3. `npm run start`

### Crontab

To run script every hour

```
* * * * * bash -c 'source /home/username/.nvm/nvm.sh && cd /home/username/gree-hvac-electricity-price && npm start' >> /home/username/logs/gree-hvac.log 2>&1
```

## More information

Based on
https://github.com/inwaar/gree-hvac-client
