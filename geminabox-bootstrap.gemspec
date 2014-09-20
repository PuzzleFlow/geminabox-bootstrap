# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'geminabox/bootstrap/version'

Gem::Specification.new do |spec|
  spec.name          = "geminabox-bootstrap"
  spec.version       = Geminabox::Bootstrap::VERSION
  spec.authors       = ["Phillip Ridlen"]
  spec.email         = ["phillip@ovenbits.com"]
  spec.summary       = %q{Bootstrap theme for Geminabox.}
  spec.description   = %q{A nice, clean theme for Geminabox based on Twitter Bootstrap.}
  spec.homepage      = "https://github.com/philtr/geminabox-bootstrap"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency "geminabox", "~> 0.11"

  spec.add_development_dependency "bundler", "~> 1.6"
  spec.add_development_dependency "rake", "~> 0"
end
