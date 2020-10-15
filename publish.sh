#!/bin/zsh

export GH_TOKEN=$(cat ../publish_byplay_standalone_token.txt)
electron-builder --
