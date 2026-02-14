from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://companion:companion_dev@localhost:5432/companion"
    redis_url: str = "redis://localhost:6379/0"

    # Auth
    jwt_secret: str = "change-me-to-a-random-secret"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    # Encryption key for provider API keys
    encryption_key: str = ""

    # Default provider keys (optional)
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # WaveSpeed AI
    wavespeed_api_key: str = ""
    wavespeed_base_url: str = "https://api.wavespeed.ai"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
