# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.0.0 [Breaking]
* Upgraded python requirements and pinned the version.  Specifically `pyyaml`, `flask`, and `yaql`
* Removed a lot of unnecessary files that were a part of the original bootstrap theme.
* Upgraded jquery library.  It's now being pulled from CDN.
* Configured session management so that a page reload will preserve the yaql and yaml.
* Updated the README.md to remove the part where it specifies you can connect to a Stackstorm instance.
* Removed the autocomplete, examples, and st2 execution retrieval.
* Added some DEBUG and INFO logging.