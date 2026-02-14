#!/usr/bin/env node

/**
 * 🗄️ Script de Inicialización de Base de Datos
 * Ejecuta el SQL completo para crear todas las tablas
 */

import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';

// Lectura del archivo SQL (está en la carpeta padre)
const sqlFile = fs.readFileSync('../database.sql', 'utf8');

// Conexión sin especificar base de datos (para crear la BD)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
        console.error('\n🔍 Verifica:');
        console.error('   1. ¿Está XAMPP/MySQL corriendo?');
        console.error('   2. ¿Usuario es "root" y password está vacía?');
        process.exit(1);
    }

    console.log('✅ Conectado a MySQL correctamente\n');
    console.log('🔄 Ejecutando script SQL completo...\n');

    // Ejecutar TODO el contenido como un query con multipleStatements
    connection.query(sqlFile, (err, results) => {
        if (err) {
            console.error('❌ Error ejecutando SQL:');
            console.error(`   ${err.message}\n`);
            connection.end();
            process.exit(1);
        } else {
            console.log('✅ Base de datos inicializada correctamente!\n');
            console.log('Tablas creadas:');
            console.log('   ✓ users');
            console.log('   ✓ games');
            console.log('   ✓ user_library');
            console.log('   ✓ índices\n');
            connection.end();
        }
    });
});
