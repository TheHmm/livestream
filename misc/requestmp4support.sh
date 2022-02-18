#!/bin/bash

# Requests mp4 video support for an asset from MUX
# arguments : 
#  $1 : the asset id

# check if environment file exists
if [ -f .env ]; then

  # get the MUX TOKEN variables from environment file.
  export $(cat .env | sed 's/#.*//g' | xargs)
  
  echo 
  echo "MUX_TOKEN_ID     :" $MUX_TOKEN_ID
  echo "MUX_TOKEN_SECRET :" $MUX_TOKEN_SECRET

  # if both token variables are defined
  if [ ! -z $MUX_TOKEN_ID ] && [ ! -z $MUX_TOKEN_SECRET ]; then

    ASSET_ID=$1 

    # if an asset id has been passed as a variable
    if [ ! -z $ASSET_ID ]; then

      # we can request MP$ support for that asset id
      echo "Requesting MP4 video support from mux for asset ID:" $ASSET_ID

      curl https://api.mux.com/video/v1/assets/${ASSET_ID}/mp4-support \
        -X PUT \
        -d '{ "mp4_support": "standard" }' \
        -H "Content-Type: application/json" \
        -u ${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}  
        
    else

      echo 
      echo "ERROR: Please provide an asset ID as the first argument."

    fi

  else

    echo
    echo "ERROR: Either one or both MUX_TOKEN_ variables were not found in environment file."

  fi

else 

  echo
  echo "ERROR: Could not locate .env file. To run this script you need to provide your MUX_TOKEN_ID and MUX_TOKEN_SECRET as variables in an environement file."

fi
