import mongoose from 'mongoose';

const CONNECTION_STRING = 'mongodb+srv://jisus0945:mWoQb0giD8mXV9A9@academic-system-closter.nxphzi8.mongodb.net/academyc-system_db01?retryWrites=true&w=majority&appName=Academic-system-closter';

async function checkDatabase() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(CONNECTION_STRING);
        console.log('✅ Conectado exitosamente a MongoDB');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        console.log('\n📊 COLECCIONES EN LA BASE DE DATOS:');
        console.log('=====================================');
        
        if (collections.length === 0) {
            console.log('❌ No hay colecciones en la base de datos');
        } else {
            collections.forEach((col, index) => {
                console.log(`${index + 1}. ${col.name}`);
            });
        }
        
        // Obtener información detallada de cada colección
        console.log('\n📋 DETALLES DE CADA COLECCIÓN:');
        console.log('===============================');
        
        for (const collection of collections) {
            console.log(`\n🔍 Colección: ${collection.name}`);
            console.log('--------------------------------');
            
            try {
                const count = await mongoose.connection.db.collection(collection.name).countDocuments();
                console.log(`📊 Total de documentos: ${count}`);
                
                if (count > 0) {
                    const sampleDoc = await mongoose.connection.db.collection(collection.name).findOne();
                    console.log('📝 Campos encontrados:');
                    Object.keys(sampleDoc).forEach(field => {
                        const value = sampleDoc[field];
                        let type = Array.isArray(value) ? 'Array' : typeof value;
                        let details = '';
                        
                        if (field === '_id') {
                            details = ' (ID único de MongoDB)';
                        } else if (field === '__v') {
                            details = ' (Versión del documento)';
                        } else if (type === 'object' && value !== null) {
                            if (value instanceof Date) {
                                type = 'Date';
                                details = ` (${value.toISOString()})`;
                            } else {
                                details = ` (${JSON.stringify(value)})`;
                            }
                        } else if (type === 'string') {
                            details = ` ("${value}")`;
                        } else if (type === 'number') {
                            details = ` (${value})`;
                        } else if (type === 'boolean') {
                            details = ` (${value})`;
                        }
                        
                        console.log(`  - ${field}: ${type}${details}`);
                    });
                    
                    // Mostrar algunos documentos de ejemplo
                    if (count <= 3) {
                        console.log('\n📄 Documentos en la colección:');
                        const docs = await mongoose.connection.db.collection(collection.name).find().toArray();
                        docs.forEach((doc, index) => {
                            console.log(`  ${index + 1}. ${JSON.stringify(doc, null, 2)}`);
                        });
                    } else {
                        console.log('\n📄 Primeros 3 documentos:');
                        const docs = await mongoose.connection.db.collection(collection.name).find().limit(3).toArray();
                        docs.forEach((doc, index) => {
                            console.log(`  ${index + 1}. ${JSON.stringify(doc, null, 2)}`);
                        });
                        console.log(`  ... y ${count - 3} documentos más`);
                    }
                } else {
                    console.log('  (Colección vacía)');
                }
            } catch (error) {
                console.log(`  Error al leer la colección: ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Conexión cerrada');
    }
}

checkDatabase(); 