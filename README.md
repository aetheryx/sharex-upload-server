# sharex-upload-server
A lightweight, dependency-less ShareX upload server in Node.js

# Instructions
## Setting up the server
```bash
git clone https://github.com/aetheryx/sharex-upload-server
cd sharex-upload-server
npm run -s generate-key # save the output of this command
pm2 start ./src/index.js --name sharex # or whatever node process manager you want to use!
```

## The configuration file
The default `config.json` has fairly sensible defaults (after you run `npm run -s generate-key`), but it might be worthwhile to take a look at what you can configure.  

###### config.port
The port the HTTP server runs on. ¯\\\_(ツ)\_/¯
###### config.key
The authorization header the server expects for authorized requests. Automatically generated for you with `npm run -s generate-key`.
###### config.fileIDLength
The length of the file identifier (the request path, the bit after your actual domain). Default is `3`. Make sure you're familiar with your `config.format` to know what this should be for you personally.
###### config.format
The format of the file identifier. There are two options available - `base62` (default) and `zws`.  

`base62` is fairly self explanatory. It's a format of 62 possible characters (`a-z`, `A-Z`, `0-9`). You don't need a high `fileIDLength` when using `base62`, the default `fileIDLength` already gives you **238,328** (`62^3`) possible files.  

`zws` is a format inspired by [zws.im](https://zws.im/). The format only contains five possible characters, so you need a higher `fileIDLength` than you would with `base62`. You can calculate `5^n` where `n` is your `fileIDLength` to see how many files you could store. The advantage of this format is that all of the characters are invisible, making it look like the link is just your domain. On the other hand, typing out the URL manually is basically impossible - you _have to_ copy it to share it.

## Setting up ShareX
1. Go to [Destinations -> Custom Uploader Settings](https://aeth.dev/b0df61)
2. Press the New button, give the entry a name, and tick [these](https://aeth.dev/519c61) destination types
3. On the Request tab,
    1. Set the method to POST
    2. Enter the URL of your domain
    3. Set the body to Binary
    4. Add a header with the key being "Authorization" and the value being your key from the `npm run -s generate-key` command

        <sup>End result should look something like [this](https://aeth.dev/7f9d32.png)</sup>
4. On the Response tab, [set the URL to your domain and then append `$json:.filename$`](https://aeth.dev/613be3).
5. Make sure you [set the Destination entries to their respective "Custom" options](https://aeth.dev/a36337).  

## Setting up Flameshot
[Flameshot](https://github.com/lupoDharkael/flameshot) is a popular Linux screenshot tool. Here's a wrapper script that pipes your screenshot directly to the file server:
```bash
domain="https://example.com" # Change to your own domain
token="Tp1f9JSFEczdGJ5/eY7TfIWdrLeMWUqt2VC4kSWY/2o=" # Change to your own token

screenshot() {
  flameshot gui -r
}

upload() {
  curl -s \
    -X POST \
    -H "Authorization: $token" \
    -H "Content-Type: image/png" \
    --data-binary @- \
    "$domain"
}

copy() {
  xclip -sel c
}

filename=$(screenshot | upload | jq -r '.filename')
echo "$domain/$filename" | copy
```


