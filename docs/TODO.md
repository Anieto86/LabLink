# TODO.md - Tareas Pendientes LabLink

## 🎯 Tareas Completadas ✅

### Infrastructure & Setup
- [x] TypeScript configuración completa (strict mode)
- [x] Vitest configurado con coverage
- [x] CI/CD pipeline con GitHub Actions
- [x] OpenAPI/Swagger documentación completa
- [x] Drizzle ORM + PostgreSQL setup
- [x] Autenticación JWT implementada
- [x] Logging con Pino configurado
- [x] Biome para linting y formatting

### Documentación
- [x] Documentación completa en inglés
- [x] API documentation con Swagger UI
- [x] Obsidian integration con templates
- [x] Warp workflows configurados

### Funcionalidades
- [x] Sistema de autenticación (register/login/refresh/logout)
- [x] Gestión de usuarios básica
- [x] Health check endpoint
- [x] Error handling estructurado

## 🔲 Tareas Pendientes

### Testing
- [ ] Tests unitarios para todos los servicios
- [ ] Tests de integración para módulos completos
- [ ] E2E tests para flujos críticos
- [ ] Test fixtures más completos

### Funcionalidades Core
- [ ] Gestión de laboratorios
- [ ] Gestión de muestras biológicas
- [ ] Gestión de equipos de laboratorio
- [ ] Reportes y análisis
- [ ] Dashboard de administración

### Performance & Monitoring
- [ ] Rate limiting
- [ ] Caching con Redis
- [ ] APM monitoring (New Relic/DataDog)
- [ ] Database indexes optimization

### Security
- [ ] Input validation mejorado
- [ ] RBAC (Role-Based Access Control)
- [ ] Audit logs
- [ ] Security headers adicionales

### DevOps
- [ ] Docker containerization
- [ ] Database migrations automáticas
- [ ] Environment-specific configs
- [ ] Production deployment pipeline

## 📋 Próximos Pasos Sugeridos

1. **Implementar tests unitarios** para auth.service.ts y users.service.ts
2. **Crear módulo de laboratorios** siguiendo el patrón establecido
3. **Dockerizar la aplicación** para deployment
4. **Configurar base de datos staging/production**

## 🚀 Para Desarrollo Diario

```bash
# Desarrollo
pnpm dev              # Start server
pnpm check           # Lint + format + typecheck
pnpm test:watch      # TDD mode

# Sync con Obsidian
pnpm obsidian:sync   # Manual sync
ll-sync              # Quick command (Warp)

# Documentación
http://localhost:3000/api-docs  # Swagger UI
```
