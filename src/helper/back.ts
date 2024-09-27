import { goto } from "$app/navigation";

const prevPage = () => {
    window.history.back()
}

export { prevPage };