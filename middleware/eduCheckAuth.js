export default function({ store, redirect }) {
    if(!store.getters['eduCenter/getIsAuth']) {
        redirect('/edu-center/login')
    }
}