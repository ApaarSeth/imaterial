# ============================================================================= 
# Build image
# ============================================================================= 

FROM node:13.13.0-alpine as build
WORKDIR /opt/node/
COPY . /opt/node/
RUN npm install
RUN npm install -g @angular/cli@8.3.21
RUN npm run build

# ============================================================================= 
# Deploy image
# ============================================================================= 

FROM nginx:alpine
MAINTAINER Nikhil <nikhil.gupta@buildsupply.com> 

# ----------------------------------------------------------------------------- 
# Create new user and group
# ------------------------------------------------------------------------------

RUN adduser -D -g 'alpine' alpine

# ----------------------------------------------------------------------------- 
# Install 
# ----------------------------------------------------------------------------- 
  
# ----------------------------------------------------------------------------- 
# Copy content 
# ----------------------------------------------------------------------------- 

COPY --from=build /opt/node/dist/imaterial/ /usr/share/nginx/html/
COPY buildScripts/nginx.conf /etc/nginx/conf.d/default.conf
COPY buildScripts/envsetup.sh /usr/share/nginx/html/

# ----------------------------------------------------------------------------- 
# Change owner and permission 
# ----------------------------------------------------------------------------- 

RUN chmod +x /usr/share/nginx/html/envsetup.sh
RUN chown alpine:alpine /usr/share/nginx/html/ -R
RUN chown alpine:alpine /etc/nginx/ -R
RUN chown alpine:alpine /var/log/nginx/ -R
RUN chmod 755 /var/log/nginx/ -R
RUN chown alpine:alpine /var/cache/nginx/ -R
RUN chown alpine:alpine /var/run/ -R

# ----------------------------------------------------------------------------- 
# Switch user
# ----------------------------------------------------------------------------- 
CMD /usr/share/nginx/html/envsetup.sh

USER alpine
WORKDIR /usr/share/nginx/html/

# ----------------------------------------------------------------------------- 
# Remove extra files 
# ----------------------------------------------------------------------------- 

# ----------------------------------------------------------------------------- 
# Set ports 
# ----------------------------------------------------------------------------- 

#ENTRYPOINT ["tail", "-f", "/dev/null"]
