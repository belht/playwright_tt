FROM mcr.microsoft.com/playwright:v1.27.1-focal AS envs

# Set arguments to be used throughout the image
ARG OPERATOR_HOME="/home/op/app"
ARG OPERATOR_USER="op"
ARG OPERATOR_UID="109"

# Set arguments for playwright parallelism and sharding
ARG PW_WORKERS_COUNT=1
ARG PW_SHARD_COUNT=1
ARG PW_SHARD_INDEX=1

# Add environment variables based on arguments
ENV NODE_ENV=production
ENV OPERATOR_HOME=${OPERATOR_HOME}
ENV OPERATOR_USER=${OPERATOR_USER}
ENV OPERATOR_UID=${OPERATOR_UID}

ENV PW_WORKERS_COUNT=${PW_WORKERS_COUNT}
ENV PW_SHARD_COUNT=${PW_SHARD_COUNT}
ENV PW_SHARD_INDEX=${PW_SHARD_INDEX}

# Add user for code to be run as
RUN useradd -ms /bin/bash -d ${OPERATOR_HOME} --uid ${OPERATOR_UID} ${OPERATOR_USER}

FROM envs AS dist

# Copy app folder
USER ${OPERATOR_USER}
WORKDIR ${OPERATOR_HOME}
COPY --chown=${OPERATOR_USER} . .
RUN npm install
RUN npx playwright install

RUN printf 'npx playwright test --workers=1' >> ${OPERATOR_HOME}/entrypoint.sh

RUN chmod 777 ${OPERATOR_HOME}/entrypoint.sh
ENTRYPOINT ["sh", "/home/op/app/entrypoint.sh" ]
