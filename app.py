
"""
YatraSetu — Flask application entry point.

Responsible only for:
    • application creation
    • configuration
    • blueprint registration
    • error handling

Business logic belongs in routes/, services/, and models/.
"""

import importlib

from flask import Flask, render_template

from config import config


# ============================================================
# BLUEPRINT REGISTRY
# ============================================================
#
# Each entry is:
#
#     (module_path, blueprint_attribute, url_prefix)
#
# Route modules are added to this registry as they are built.
#
# During incremental development, a route module that genuinely
# does not exist yet is skipped. However, import errors INSIDE an
# existing module are NOT swallowed, because doing so could hide
# real application bugs.
# ============================================================

BLUEPRINTS = [
    ("routes.main", "main_bp", None),
    ("routes.api", "api_bp", "/api"),
    ("routes.destinations", "destinations_bp", "/destinations"),
    ("routes.itinerary", "itinerary_bp", "/itinerary"),
    ("routes.submissions", "submissions_bp", "/submissions"),
    ("routes.safety", "safety_bp", "/safety"),
    ("routes.admin", "admin_bp", "/yatrasetu-admin"),
    ("routes.tourist", "tourist_bp", "/tourist"),
    ("routes.voice", "voice_bp", "/voice"),
]


def register_blueprints(app):
    """
    Import and register planned blueprints.

    A blueprint is skipped only when its route module itself does
    not exist yet. If an existing module contains a broken import
    or other import-time error, that error is allowed to surface
    instead of being silently hidden.
    """
    for module_path, attr_name, url_prefix in BLUEPRINTS:

        try:
            module = importlib.import_module(module_path)

        except ModuleNotFoundError as exc:
            # Only ignore the error when the planned route module
            # itself does not exist.
            #
            # Example:
            #   routes.api does not exist yet → skip.
            #
            # But:
            #   routes.api exists and imports a missing dependency
            #   → re-raise so the real problem is visible.
            missing_module = exc.name

            if missing_module == module_path:
                continue

            raise

        blueprint = getattr(module, attr_name, None)

        if blueprint is None:
            raise RuntimeError(
                f"{module_path} exists but does not expose the expected "
                f"blueprint '{attr_name}'."
            )

        app.register_blueprint(
            blueprint,
            url_prefix=url_prefix,
        )


# ============================================================
# ERROR HANDLERS
# ============================================================

def register_error_handlers(app):
    """
    Register application-wide error pages.

    The custom 500 handler is used for normal non-debug execution.
    In Flask debug mode, Flask may show its interactive debugger
    instead, which is intentional for local development.
    """

    @app.errorhandler(404)
    def not_found(error):
        return render_template("404.html"), 404

    @app.errorhandler(500)
    def server_error(error):
        # Log the full server-side exception while returning only
        # a safe generic response to the client.
        app.logger.exception("Internal server error")

        return render_template("500.html"), 500


# ============================================================
# APPLICATION FACTORY
# ============================================================

def create_app():
    """
    Create and configure the YatraSetu Flask application.

    This function intentionally contains no database initialization,
    API calls, authentication logic, or business logic.
    """

    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static",
    )

    # --------------------------------------------------------
    # Configuration
    # --------------------------------------------------------

    config.validate()

    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["DEBUG"] = config.DEBUG

    # --------------------------------------------------------
    # Application components & database initialization
    # --------------------------------------------------------

    try:
        from models.database import ensure_tables_exist
        ensure_tables_exist()
    except Exception:
        app.logger.warning("Database auto-init skipped or deferred.")

    register_blueprints(app)
    register_error_handlers(app)

    return app


# ============================================================
# APPLICATION INSTANCE
# ============================================================

app = create_app()


# ============================================================
# DEVELOPMENT SERVER
# ============================================================
#
# Flask's built-in development server is appropriate for local
# development and the SIH prototype.
#
# A production deployment should use a proper WSGI server rather
# than relying on app.run().
# ============================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=config.DEBUG, use_reloader=True)

