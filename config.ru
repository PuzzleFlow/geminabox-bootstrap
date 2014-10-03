$: << File.expand_path('../lib', __FILE__)

require "rubygems"
require "bundler/setup"
Bundler.require
require "logger"
require "rack/auth/basic"
require "net/http"
require "uri"
require "geminabox/bootstrap"

Geminabox.data = File.expand_path("../geminabox-data", __FILE__)
Geminabox.build_legacy = false

logger = Logger.new(File.expand_path('../geminabox.log', __FILE__))

class SimpleAuth
  REALM = "Please log in with your PuzzleFlow Redmine account"
  KEY_PATH_REGEXP = %r{^/key/([^/]+)(/.+)$}

  def initialize(app, logger)
    @app = app
    @logger = logger
    @auth = Rack::Auth::Basic.new(app, REALM, &method(:authorize))
  end

  def call(env)
    req = Rack::Request.new(env)
    res = nil

    if req.get?
      @app.call(env)
    else
     if req.path_info =~ KEY_PATH_REGEXP
        key = $1
        if authorize('key', key)
          env['PATH_INFO'] = $2
          res = @app.call(env)
        end
      else
        res = @auth.call(env)
      end

      if !res || res[0] == 401
        [401, {"WWW-Authenticate" => "Basic realm=\"#{REALM}\""}, ["Unauthorized"]] # Fix the problem with apache timeout
      else
        res
      end
    end

  rescue
    @logger.error $!
    @logger.error $!.backtrace.join("\n")
    [500, {}, ["Server Error: #{$!}"]]
  end

  private

  def authorize(user, pass)
    Net::HTTP.start('int.puzzleflow.com', nil, :use_ssl => true, :verify_mode => OpenSSL::SSL::VERIFY_NONE) do |http|
      req = Net::HTTP::Get.new('/projects/framework.xml')
      if user == 'key'
        req['X-Redmine-API-Key'] = pass
      else
        req.basic_auth user, pass
      end
      response = http.request(req)
      response.is_a?(Net::HTTPSuccess)
    end
  end

  def verify_key(key)
    true
  end
end

use SimpleAuth, logger
run Geminabox::Server
