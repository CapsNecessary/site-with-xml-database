document.addEventListener( "DOMContentLoaded", function (){
	console.log( 0 );
	const navList = document.getElementById( "menu" );
	const main = document.querySelector( "main" );

	function loadXML( callback ){
		fetch(".xml")
			.then( res => res.text() )
			.then( str => new window.DOMParser().parseFromString( str, "text/xml" ) )
			.then( data => callback( data ) )
			.catch( err => console.error( "Błąd wczytywania XML:", err ) );
	}

	function buildMenu( xml ){
		const podstrony = xml.querySelectorAll( "podstrona" );
		podstrony.forEach(p => {
			const title = p.querySelector( "tytul" ).textContent;
			const url = p.querySelector( "adres" ).textContent;

			const li = document.createElement( "li" );
			const a = document.createElement( "a" );
			a.href = "#" + url;
			a.textContent = title;
			li.appendChild( a );
			navList.appendChild( li );
		});
	}

	function showPage( xml, hash ){
		const adres = hash.replace( /^#/, '' );
		const p = Array.from(xml.querySelectorAll( "podstrona" )).find( p =>
			p.querySelector( "adres" ).textContent === adres
		);

		if(p){
			const tytul = p.querySelector( "tytul" ).textContent;
			const tresc = p.querySelector( "tresc" ).textContent;
			const obraz = p.querySelector( "obraz" ).textContent;

			main.innerHTML = `
				<article>
					<h2>${tytul}</h2>
					${tresc}
					<img src="${obraz}" alt="${tytul}" style="max-width: 100%; margin-top: 10px;">
				</article>
			`;
		} else {
			main.innerHTML = `
				<article>
					<h2>Nie znaleziono strony</h2>
					<p>Podana podstrona nie istnieje lub została usunięta.</p>
				</article>
			`;
		}
	}

	function init( xml ){
		buildMenu( xml );
		if ( window.location.hash ){
			showPage( xml, window.location.hash );
		}

		window.addEventListener( "hashchange", () => {
			showPage( xml, window.location.hash );
		});
	}

	loadXML( init );
	console.log( 1 );
});
