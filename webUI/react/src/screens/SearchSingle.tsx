import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router-dom';
import MangaGrid from '../components/MangaGrid';
import NavBarTitle from '../context/NavbarTitle';

const useStyles = makeStyles((theme) => ({
    root: {
        TextField: {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function SearchSingle() {
    const { setTitle } = useContext(NavBarTitle);
    const { sourceId } = useParams<{sourceId: string}>();
    const classes = useStyles();
    const [error, setError] = useState<boolean>(false);
    const [mangas, setMangas] = useState<IManga[]>([]);
    const [message, setMessage] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [lastPageNum, setLastPageNum] = useState<number>(1);

    const textInput = React.createRef<HTMLInputElement>();

    useEffect(() => {
        fetch(`http://127.0.0.1:4567/api/v1/source/${sourceId}`)
            .then((response) => response.json())
            .then((data: { name: string }) => setTitle(`Search: ${data.name}`));
    }, []);

    function processInput() {
        if (textInput.current) {
            const { value } = textInput.current;
            if (value === '') {
                setError(true);
                setMessage('Type something to search');
            } else {
                setError(false);
                setSearchTerm(value);
                setMessage('');
            }
        }
    }

    useEffect(() => {
        if (searchTerm.length > 0) {
            fetch(`http://127.0.0.1:4567/api/v1/source/${sourceId}/search/${searchTerm}/${lastPageNum}`)
                .then((response) => response.json())
                .then((data: { mangaList: IManga[], hasNextPage: boolean }) => {
                    if (data.mangaList.length > 0) {
                        setMangas([
                            ...mangas,
                            ...data.mangaList.map((it) => ({
                                title: it.title, thumbnailUrl: it.thumbnailUrl, id: it.id,
                            }))]);
                        setHasNextPage(data.hasNextPage);
                    } else {
                        setMessage('search qeury returned nothing.');
                    }
                });
        }
    }, [searchTerm]);

    const mangaGrid = (
        <MangaGrid
            mangas={mangas}
            message={message}
            hasNextPage={hasNextPage}
            lastPageNum={lastPageNum}
            setLastPageNum={setLastPageNum}
        />
    );

    return (
        <>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField inputRef={textInput} error={error} id="standard-basic" label="Search text.." />
                <Button variant="contained" color="primary" onClick={() => processInput()}>
                    Search
                </Button>
            </form>
            {mangaGrid}
        </>
    );
}
