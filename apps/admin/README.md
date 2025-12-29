PT PERANCAH PRO ALAT DASHBOARD:

Getting started,

git clone this repo

npm install

npm run dev

There are two supabase projects, one is called PT-Backend which is prod, and PT-Backend Dev which is the dev database.

There are two .env files, .env.development and .env.production. For dev
make .env.development contain the SUPABASE variables of your dev supabase project
and .env.production contain the SUPABASEvariables of your prod supabase project.

Ag-grid currently contains some bad type hinting so that needs to be fixed

Things to note:

QueryError refers to the error type returned by Supabase, it is the wrong type because
it does not consider detail or hint as nullable. Our correct type is defined by TQueryError.
