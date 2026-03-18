#!/bin/sh
# ----------------------------------------------------------------------------
# Minimal Maven Wrapper bootstrap script.
# Downloads and runs the Maven Wrapper implementation when needed.
# ----------------------------------------------------------------------------

set -e

BASE_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
WRAPPER_DIR="$BASE_DIR/.mvn/wrapper"
PROPERTIES_FILE="$WRAPPER_DIR/maven-wrapper.properties"
WRAPPER_VERSION="3.3.2"
WRAPPER_JAR="$WRAPPER_DIR/maven-wrapper-${WRAPPER_VERSION}.jar"
WRAPPER_MAIN_CLASS="org.apache.maven.wrapper.MavenWrapperMain"

if [ ! -f "$PROPERTIES_FILE" ]; then
  echo "Missing $PROPERTIES_FILE" >&2
  exit 1
fi

if [ ! -f "$WRAPPER_JAR" ]; then
  echo "Downloading Maven wrapper jar..."
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$WRAPPER_JAR" "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/${WRAPPER_VERSION}/maven-wrapper-${WRAPPER_VERSION}.jar"
  elif command -v wget >/dev/null 2>&1; then
    wget -q -O "$WRAPPER_JAR" "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/${WRAPPER_VERSION}/maven-wrapper-${WRAPPER_VERSION}.jar"
  else
    echo "Neither curl nor wget is available to download the Maven wrapper jar." >&2
    exit 1
  fi
fi

exec java -classpath "$WRAPPER_JAR" "-Dmaven.multiModuleProjectDirectory=$BASE_DIR" $MAVEN_OPTS "$WRAPPER_MAIN_CLASS" "$@"
