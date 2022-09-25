# CC

Webpage for generating closed captions.

Forked from here: https://github.com/steveseguin/captionninja and configured to send captions to the Strapi server.

## Installation

This directory contains an index.html file that you can serve statically. It pulls the necessary javascript from the scripts directory.

It is important that you change all the server URLs in [index.html](index.html) to the appropriate ones.
## Deployment

Copy these files to a web accessible directory.
## Apache / Nginx Configuration

Point a dedicated domain to this directory. See the [example apache config](./cc.apache.example.conf).
