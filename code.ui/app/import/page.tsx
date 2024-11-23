


import Layout from "../(auth-pages)/layout";
import { redirect } from 'next/navigation';
import ImportComponent from './import';


export default async function ClassificationPage() {
    return (
    <Layout>
        <ImportComponent />
    </Layout>
    );
}
