#!/bin/bash

echo "🔄 Génération de la documentation Swagger..."
swag init --parseDependency --parseInternal

if [ $? -eq 0 ]; then
    echo "✅ Documentation Swagger générée avec succès!"
    echo "📖 Accédez à la documentation sur: http://localhost:8080/swagger/index.html"
    echo ""
    echo "💡 Pour démarrer le serveur: go run main.go"
else
    echo "❌ Erreur lors de la génération de la documentation"
    exit 1
fi 