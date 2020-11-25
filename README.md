# SINF 
---
### MongoDB Config

1. Install MongoDb
   
   ```
    $ brew tap mongodb/brew
    $ brew install mongodb-community
    $ brew services start mongodb-community
    
    If you have a previous version of mongodb
    
    $ brew services stop mongodb
    $ brew uninstall mongodb
    $ brew tap mongodb/brew
    $ brew install mongodb-community
    $ brew services start mongodb-community
   ```
   **NOTE:** This commands are the ones used for homebrew on MacOS

2. Create data storage for mongo
    ```
    $ mkdir -p /data/db
    ```
    If this command doesn't work, create this folder anywhere, and then change the mongodb.conf file with the path for the folder created. 
    https://stackoverflow.com/questions/7247474/how-can-i-tell-where-mongodb-is-storing-data-its-not-in-the-default-data-db

3. Create DB
   ```
    $ mongo
    > use sinf
    ```
---
### Project Running

1. Run the Server side 
    ```
   $ nodemon index.js
    ```
2. Run the Client
    ```
   $ npm start
    ```
---
#### Usefull links and software
- [Configuration tutorial](https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66)
- [Robo 3T - software to view the Db content](https://robomongo.org)
- [Postman - to test server requests](https://www.postman.com)