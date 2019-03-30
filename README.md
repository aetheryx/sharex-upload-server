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

## Setting up ShareX
1. Go to [Destinations -> Custom Uploader Settings](https://aeth.dev/b0df61.png)
2. Press the New button, give the entry a name, and tick [these](https://aeth.dev/519c61.png) destination types
3. On the Request tab,
    1. Set the method to POST
    2. Enter the URL of your domain
    3. Set the body to Binary
    4. Add a header with the key being "Authorization" and the value being your key from the `npm run -s generate-key` command

        <sup>End result should look something like [this](https://aeth.dev/7f9d32.png)</sup>
4. On the Response tab, [set the URL to your domain and then append `$json:.filename$`](https://aeth.dev/613be3.png).
5. Make sure you [set the Destination entries to their respective "Custom" options](https://aeth.dev/a36337.png).
