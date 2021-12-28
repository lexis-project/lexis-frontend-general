module.exports = {
    apps : [{
      name: "wp8-client",
      script: "serve-client.js",
      log_file: 'logs/wp8-client.log'
    },
    {
        name: "wp8-be",
        script: "../lexis-be/server.js",
        env: {
          NODE_ENV: "staging",
          USER_ROLE: "org_mgr"
        },
        log_file: 'logs/wp8-be.log'
      }]
  }
  