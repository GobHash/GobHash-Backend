const pm2 = require('pm2');

const MACHINE_NAME = 'heroku-production';
const PRIVATE_KEY = process.env.KEYMETRICS_PUBLIC;
const PUBLIC_KEY = process.env.KEYMETRICS_SECRET;

const instances = 4; // Set by Heroku or -1 to scale to max cpu core -1
const maxMemory = process.env.WEB_MEMORY || 512;    // " " "

pm2.connect(() => {
  pm2.start({
    script: 'dist/index.js',
    name: 'production-app',           // ----> THESE ATTRIBUTES ARE OPTIONAL:
    exec_mode: 'cluster',            // ----> https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#schema
    instances,
    max_memory_restart: `${maxMemory}'M'`,   // Auto restart if process taking more than XXmo
    post_update: ['npm install']       // Commands to execute once we do a pull from Keymetrics
  }, () => {
    pm2.interact(PRIVATE_KEY, PUBLIC_KEY, MACHINE_NAME, () => {
     // Display logs in standard
     // output
      pm2.launchBus((err, bus) => {
        console.log('[PM2] Log streaming started');                    // eslint-disable-line
        bus.on('log:out', (packet) => {
          console.log('[App:%s] %s', packet.process.name, packet.data); // eslint-disable-line
        });
        bus.on('log:err', (packet) => {
          console.error('[App:%s][Err] %s', packet.process.name, packet.data); // eslint-disable-line
        });
      });
    });
  });
});
