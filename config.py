
"""
YatraSetu centralized configuration.

Loads environment variables from .env and exposes them through a
single Config object for use across app.py, models/, routes/, and
services/.

The public interface is intentionally simple:

    from config import config

    config.SECRET_KEY
    config.MYSQL_HOST
    config.GEMINI_API_KEY
    config.WEATHER_API_KEY

No application/business logic belongs in this module.
"""

import os

from dotenv import load_dotenv


# Load variables from the project's .env file into the process
# environment. Existing environment variables are not overwritten.
load_dotenv()


def _get_bool_env(name, default=False):
    """
    Parse a boolean environment variable safely.

    Accepted true values:
        1, true, yes, on

    Accepted false values:
        0, false, no, off

    Raises:
        ValueError: if the value is present but not recognizable.
    """
    value = os.environ.get(name)

    if value is None:
        return default

    normalized = value.strip().lower()

    if normalized in {"1", "true", "yes", "on"}:
        return True

    if normalized in {"0", "false", "no", "off"}:
        return False

    raise ValueError(
        f"Invalid boolean value for {name!r}: {value!r}. "
        "Use one of: 1, 0, true, false, yes, no, on, off."
    )


def _get_int_env(name, default):
    """
    Parse an integer environment variable safely.

    Raises:
        ValueError: if the value is present but is not a valid integer.
    """
    value = os.environ.get(name)

    if value is None or value.strip() == "":
        return default

    try:
        return int(value)
    except ValueError as exc:
        raise ValueError(
            f"Invalid integer value for {name!r}: {value!r}."
        ) from exc


class Config:
    # ------------------------------------------------------------------
    # Flask
    # ------------------------------------------------------------------

    # Used by Flask to sign session cookies and other security-sensitive
    # values. A strong value MUST be used outside local development.
    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "dev-only-insecure-key",
    )

    # Flask 2.3+ removed the old FLASK_ENV configuration mechanism.
    # Use FLASK_DEBUG instead.
    DEBUG = _get_bool_env("FLASK_DEBUG", default=True)

    # Convenience flag used by YatraSetu's own configuration logic.
    IS_PRODUCTION = not DEBUG

    # ------------------------------------------------------------------
    # MySQL
    # ------------------------------------------------------------------

    MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")

    MYSQL_PORT = _get_int_env(
        "MYSQL_PORT",
        3306,
    )

    MYSQL_USER = os.environ.get(
        "MYSQL_USER",
        "root",
    )

    MYSQL_PASSWORD = os.environ.get(
        "MYSQL_PASSWORD",
        "",
    )

    MYSQL_DATABASE = os.environ.get(
        "MYSQL_DATABASE",
        "yatrasetu",
    )

    # ------------------------------------------------------------------
    # External APIs
    # ------------------------------------------------------------------
    #
    # These values are used only by backend services.
    # They must NEVER be exposed to frontend JavaScript, HTML, or
    # client-side configuration.

    GEMINI_API_KEY = os.environ.get(
        "GEMINI_API_KEY",
        "",
    )

    WEATHER_API_KEY = os.environ.get(
        "WEATHER_API_KEY",
        "",
    )

    GOOGLE_MAPS_API_KEY = os.environ.get(
        "GOOGLE_MAPS_API_KEY",
        "",
    )

    # ------------------------------------------------------------------
    # Prototype Tourism Board Admin
    # ------------------------------------------------------------------

    ADMIN_USERNAME = os.environ.get(
        "ADMIN_USERNAME",
        "admin",
    )

    # Store a Werkzeug password hash, never the plaintext password.
    ADMIN_PASSWORD_HASH = os.environ.get(
        "ADMIN_PASSWORD_HASH",
        "",
    )

    @classmethod
    def validate(cls):
        """
        Validate configuration required for the current environment.

        Development:
            Missing optional credentials produce warnings so the
            project can be built incrementally.

        Production:
            A real SECRET_KEY and admin password hash are required.
            External API keys and database credentials are also checked
            because production features depend on them.

        This method does not attempt to connect to MySQL or external
        APIs. Connectivity is validated by the relevant services.
        """

        missing = []

        # A real Flask secret is mandatory outside development.
        if cls.IS_PRODUCTION and (
            not cls.SECRET_KEY
            or cls.SECRET_KEY == "dev-only-insecure-key"
        ):
            missing.append("SECRET_KEY")

        # Database username/database name are required regardless of
        # whether the password happens to be empty.
        if not cls.MYSQL_HOST.strip():
            missing.append("MYSQL_HOST")

        if not cls.MYSQL_USER.strip():
            missing.append("MYSQL_USER")

        if not cls.MYSQL_DATABASE.strip():
            missing.append("MYSQL_DATABASE")

        # Production requires credentials for the external services
        # used by the deployed YatraSetu feature set.
        if cls.IS_PRODUCTION:
            if not cls.GEMINI_API_KEY.strip():
                missing.append("GEMINI_API_KEY")

            if not cls.WEATHER_API_KEY.strip():
                missing.append("WEATHER_API_KEY")

            if not cls.ADMIN_PASSWORD_HASH.strip():
                missing.append("ADMIN_PASSWORD_HASH")

        if missing:
            message = (
                "Missing required environment variable(s): "
                + ", ".join(missing)
                + ". Set them in your .env before starting the application."
            )

            if cls.IS_PRODUCTION:
                raise RuntimeError(message)

            print(
                "[YatraSetu config] Warning: "
                + message
                + " Some features may be unavailable until configured."
            )


# Public configuration interface used throughout the application.
#
# This intentionally exposes the class itself rather than creating an
# instance, so existing imports such as `from config import config`
# continue to work unchanged.
config = Config

