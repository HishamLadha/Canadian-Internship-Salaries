from sqlmodel import SQLModel, Field
from typing import List
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY


# A model for the list of Canadian Universities and their corresponding domains
class Universities(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    domains: List[str] = Field(sa_column=Column(ARRAY(String)))