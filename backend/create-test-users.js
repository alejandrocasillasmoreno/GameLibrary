import bcrypt from 'bcrypt';
import pool from './src/config/db.js';

async function createTestUsers() {
    try {
        console.log('🔐 Creando usuarios de prueba...');
        
        // Contraseñas encriptadas
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('user123', 10);
        
        // Verificar si los usuarios ya existen
        const [adminExists] = await pool.query('SELECT * FROM users WHERE email = ?', ['admin@test.com']);
        const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', ['user@test.com']);
        
        if (adminExists.length === 0) {
            // Crear usuario administrador
            await pool.query(
                'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
                ['Admin User', 'admin@test.com', adminPassword, 1]
            );
            console.log('✅ Usuario administrador creado: admin@test.com / admin123');
        } else {
            console.log('⚠️  Usuario administrador ya existe');
        }
        
        if (userExists.length === 0) {
            // Crear usuario estándar
            await pool.query(
                'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
                ['User Test', 'user@test.com', userPassword, 2]
            );
            console.log('✅ Usuario estándar creado: user@test.com / user123');
        } else {
            console.log('⚠️  Usuario estándar ya existe');
        }
        
        // Verificar roles
        const [roles] = await pool.query('SELECT * FROM roles');
        console.log('📋 Roles disponibles:');
        roles.forEach(role => {
            console.log(`   - ${role.name} (ID: ${role.id})`);
        });
        
        // Verificar permisos del admin
        const [adminPermisos] = await pool.query(`
            SELECT p.name 
            FROM users u
            JOIN roles r ON u.role_id = r.id
            JOIN role_permissions rp ON r.id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE u.email = 'admin@test.com'
        `);
        console.log(`🔐 Permisos del admin: ${adminPermisos.length}`);
        
        // Verificar permisos del usuario
        const [userPermisos] = await pool.query(`
            SELECT p.name 
            FROM users u
            JOIN roles r ON u.role_id = r.id
            JOIN role_permissions rp ON r.id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE u.email = 'user@test.com'
        `);
        console.log(`🔐 Permisos del usuario: ${userPermisos.length}`);
        
        console.log('\n🎯 Credenciales de prueba:');
        console.log('   Admin: admin@test.com / admin123');
        console.log('   User:  user@test.com / user123');
        console.log('\n✅ Usuarios de prueba creados exitosamente!');
        
    } catch (error) {
        console.error('❌ Error creando usuarios:', error);
    } finally {
        await pool.end();
    }
}

createTestUsers();