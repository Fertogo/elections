# A Cryptographically Secure System for the MIT Community

For a design overview and security analysis see the [technical report](http://fernandotrujano.com/docs/mitvoting.pdf). 

### To Deploy
1. Install required packages `npm install`
2. Set up [mit-cert-auth](https://github.com/vfazel/mit-cert-auth)
    1. Edit `mit-cert-auth/config.json`
    2. Run `node deploy-auth.js` from the `mit-cert-auth` directory
3. Run `mongod` on localhost or set a mongodb URI as `UAP_URI` env variable. 
4. Run the server with `npm start`