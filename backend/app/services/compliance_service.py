"""Servico de auditoria — stub para versao academica.

Na versao completa, este modulo conecta ao motor de testes.
Nesta versao academica, os dados sao consultados diretamente do banco.
"""

from __future__ import annotations


def classify_score(score: float) -> dict:
    """Retorna label e cor para um score."""
    if score >= 90:
        return {"label": "Excelente", "color": "green"}
    if score >= 75:
        return {"label": "Bom", "color": "yellow"}
    if score >= 50:
        return {"label": "Atencao", "color": "orange"}
    return {"label": "Critico", "color": "red"}
