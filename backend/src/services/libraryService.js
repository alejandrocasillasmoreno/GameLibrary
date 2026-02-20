import pool from '../config/db.js';

export const addGameToLibrary = async (userId, gameId, titulo, imagen_url, plataforma) => {
    try {
        console.log('🔍 Verificando duplicado para:', { userId, gameId });
        
        // 1. Verificar si el juego ya existe en la tabla games
        const [gameRows] = await pool.query('SELECT id FROM games WHERE id = ?', [gameId]);
        
        // Si no existe, lo insertamos en games
        if (gameRows.length === 0) {
            await pool.query(
                'INSERT INTO games (id, title, image_url, platform) VALUES (?, ?, ?, ?)',
                [gameId, titulo, imagen_url, plataforma]
            );
            console.log(`✅ Juego ${titulo} insertado en tabla games`);
        }

        // 2. Verificar duplicado en user_library
        const [existing] = await pool.query(
            'SELECT * FROM user_library WHERE user_id = ? AND game_id = ?',
            [userId, gameId]
        );
        if (existing.length > 0) {
            throw new Error('El juego ya está en tu biblioteca');
        }

        // 3. Insertar en user_library
        const [result] = await pool.query(
            'INSERT INTO user_library (user_id, game_id, titulo, imagen_url, plataforma, status, valoracion) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, gameId, titulo, imagen_url, plataforma, 'pending', 0]
        );
        
        console.log('✅ Juego insertado exitosamente en biblioteca, ID:', result.insertId);
        
    } catch (error) {
        console.error('❌ Error en addGameToLibrary:', error);
        throw error;
    }
};

export const getUserLibrary = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM user_library WHERE user_id = ?', [userId]);
    return rows;
};

export const getLibraryGameById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM user_library WHERE id = ?', [id]);
    return rows[0];
};

export const updateLibraryGame = async (id, status, valoracion) => {
    console.log('🔍 Actualizando juego en biblioteca:', {
        id,
        status,
        valoracion,
        statusType: typeof status,
        valoracionType: typeof valoracion
    });
    
    const fields = [];
    const values = [];
    if (status !== undefined) {
        fields.push('STATUS = ?');
        values.push(status);
    }
    if (valoracion !== undefined) {
        fields.push('valoracion = ?');
        values.push(valoracion);
    }
    if (fields.length === 0) {
        console.log('⚠️ No hay campos para actualizar');
        return false;
    }
    
    const query = `UPDATE user_library SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    console.log('📝 Query SQL:', query);
    console.log('📝 Valores:', values);
    
    const [result] = await pool.query(query, values);
    
    console.log('📊 Resultado de actualización:', {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
        message: result.message
    });
    
    return result.affectedRows > 0;
};

export const deleteLibraryGame = async (id) => {
    const [result] = await pool.query('DELETE FROM user_library WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

export const updateGameStatus = async (entryId, status) => {
    const [result] = await pool.query(
        'UPDATE user_library SET STATUS = ? WHERE id = ?',
        [status, entryId]
    );
    return result.affectedRows > 0;
};
