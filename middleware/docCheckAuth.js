export default function({ store, redirect }) {
    if(!store.getters['doctors/getIsAuth']) {
        redirect('/doctor/login')
    } else {
        redirect('/doctor/profile')
    }
}