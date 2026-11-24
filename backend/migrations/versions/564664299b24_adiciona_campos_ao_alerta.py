
"""adiciona campos ao alerta

Revision ID: 564664299b24
Revises: 938ee5ea999f
"""

from alembic import op
import sqlalchemy as sa


revision = '564664299b24'
down_revision = '938ee5ea999f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'alertas',
        sa.Column('situacao', sa.String(length=150), nullable=True)
    )

    op.add_column(
        'alertas',
        sa.Column('data_ocorrencia', sa.Date(), nullable=True)
    )

    op.add_column(
        'alertas',
        sa.Column('horario_aproximado', sa.Time(), nullable=True)
    )

    op.add_column(
        'alertas',
        sa.Column('local_referencia', sa.String(length=150), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('alertas', 'local_referencia')
    op.drop_column('alertas', 'horario_aproximado')
    op.drop_column('alertas', 'data_ocorrencia')
    op.drop_column('alertas', 'situacao')
