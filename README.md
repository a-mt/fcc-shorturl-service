# URL Shortener Microservice

User stories:

* I can pass a URL as a parameter `/new/https://www.google.com` and I will receive a shortened URL in the JSON response.

  ```
  { "original_url":"http://www.google.com", "short_url":"https://little-url.herokuapp.com/2871" }
  ```

* If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

  ```
  {"error":"Wrong url format, make sure you have a valid protocol and real site."}
  ```

* When I visit that shortened URL, it will redirect me to my original link.

## Run

* Create a database on [Mongo Atlas](https://cloud.mongodb.com/)

* Set the MONGOLAB_URI environment variable

  ```
  MONGOLAB_URI=mongodb+srv://USERNAME:PASSSWORD@urlshortener.ehul9lb.mongodb.net/?retryWrites=true&w=majority&appName=urlshortener
  ```

* Install the dependencies

  ```
  npm install
  ```

* Start

  ```
  npm start
  ```

## Deploy on Netlify

``` bash
netlify init
netlify env:set MONGOLAB_URI YOUR_URI_HERE
netlify deploy
netlify deploy --prod
```