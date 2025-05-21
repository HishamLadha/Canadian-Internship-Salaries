from sqlmodel import Field, SQLModel

# model for a role/ job name
class Role(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    role_name: str 