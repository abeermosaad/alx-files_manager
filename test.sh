#!/bin/bash
curl 127.0.0.1:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
curl 127.0.0.1:5000/users/me -H "X-Token: bce31119-989c-4b95-9daa-e7eca118cc86" ; echo ""
curl 127.0.0.1:5000/disconnect -H "X-Token: bce31119-989c-4b95-9daa-e7eca118cc86" ; echo ""
curl 127.0.0.1:5000/users/me -H "X-Token: bce31119-989c-4b95-9daa-e7eca118cc86" ; echo ""
