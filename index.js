import concurrently from 'concurrently';

concurrently([
    {command: 'npm run dev', name: 'server', cwd: './server', prefixColor: 'pink'},
   // {command: 'npm run dev', name: 'client', cwd: './client', prefixColor: 'green'},
])