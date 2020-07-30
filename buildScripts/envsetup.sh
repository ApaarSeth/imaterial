set -x

echo "" > /usr/share/nginx/html/assets/env.js
echo "(function(window) {window.env = {}; window.env.api_url = '"$BUILDSUPPLY_IM_BASE_API_URL"'" >> /usr/share/nginx/html/assets/env.js
echo "(function(window) {window.env = {}; window.env.payment_url = '"$BUILDSUPPLY_IM_PAYMENT_API_URL"'" >> /usr/share/nginx/html/assets/env.js
echo "})(this);"  >> /usr/share/nginx/html/assets/env.js


CMD ["nginx" "-g" "daemon off;"]