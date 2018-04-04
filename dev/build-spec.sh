#!/bin/bash

yimp -i spec.yaml > generated.yaml
echo "export const Spec = $(yaml2json generated.yaml)" > ../../js/tes.js
