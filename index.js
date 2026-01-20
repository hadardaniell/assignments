import concurrently from 'concurrently';

concurrently([
    {command: 'npm run dev', name: 'server', cwd: './server', prefixColor: 'blue'},
    {command: 'npm run dev', name: 'client', cwd: './client/recipeApp', prefixColor: 'green'},
])