# Instrucciones para Claude Code - AWS Developer Associate DVA-C02

## Permisos

Claude puede crear y modificar archivos y subdirectorios en este repositorio para registrar notas de estudio, transcripts y progreso.

## Perfil del estudiante

- Desarrollador en Uruguay, trabajando para Vairix (servicios offshore para clientes de EEUU)
- Usa servicios comunes de AWS en el dia a dia
- Preparandose para la certificacion AWS Certified Developer Associate (DVA-C02)
- Curso: [Ultimate AWS Certified Developer Associate 2026 DVA-C02](https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/) de Stephane Maarek

## Enfoque para servicios poco conocidos

Cuando un servicio sea poco familiar o dificil de retener sin uso practico:
1. **Por que existe** - El problema que resuelve
2. **Quien lo usa** - Caso de uso tipico
3. **Que cae en el examen** - Lo que hay que saber para el DVA-C02
4. **Regla simple** - Una forma facil de recordarlo

## Flujo de trabajo obligatorio por leccion

### Paso 1: Recibir transcript
El usuario pega el transcript del video. NUNCA usar MCP/Playwright para obtener transcripts.

### Paso 2: Crear archivo de notas
Crear un archivo MD en: `/transcripts/{seccion}/{numero}-{nombre}.md`
- Ejemplo: `/transcripts/3-IAM-CLI/3.1-IAM-Introduction.md`

### Paso 3: Verificar nombres
Verificar los nombres de las lecciones contra el curso de Udemy. NUNCA inventar nombres.

### Paso 4: Ensenar en Modo Wizard
Desglosa el contenido paso a paso siguiendo el formato de Modo Wizard (ver abajo).

### Paso 5: Quiz
Realizar quiz interactivo al finalizar la explicacion.

### Paso 6: Actualizar progreso
Actualizar `progress/quiz-results.md` y `STUDY_PLAN.md`.

### Paso 7: Siguiente leccion
Indicar cual es la siguiente leccion y esperar al usuario.

## Modo Wizard (formato de ensenanza)

1. Extraer 3-6 conceptos clave de la leccion
2. Presentar UN concepto a la vez con:
   - Explicacion clara
   - Diagrama ASCII si es util
   - Ejemplo practico
3. **Esperar confirmacion del usuario** antes de continuar al siguiente concepto
4. NUNCA volcar todos los conceptos de golpe

## Formato de Quiz

1. UNA pregunta a la vez (A/B/C/D multiple choice)
2. Esperar la respuesta del usuario antes de mostrar la siguiente
3. Feedback inmediato con explicacion
4. **ALEATORIZAR** la posicion de las respuestas correctas. NO caer en patrones (ej: siempre B y C). Antes de construir el quiz, decidir posiciones: ej [D, A, C, B]
5. Al finalizar: mostrar puntaje, XP ganado, actualizar `quiz-results.md` y `STUDY_PLAN.md`

### Sistema de XP
- +25 XP por respuesta correcta
- 2-4 preguntas por leccion (segun complejidad)
- Las preguntas deben derivarse EXCLUSIVAMENTE del contenido del transcript, NUNCA de memoria

### Umbrales
- 75%+ = Aprobado
- 100% = PERFECTO
- Menos de 75% = Marcado como "REPASAR" en STUDY_PLAN.md

## Estado actual

- **Seccion actual:** Pendiente de iniciar
- **Leccion actual:** Ninguna
- **Proxima leccion:** Seccion 1, Leccion 1 (Course Introduction)
- **XP total:** 0
- **Lecciones completadas:** 0
