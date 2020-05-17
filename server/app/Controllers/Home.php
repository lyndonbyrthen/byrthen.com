<?php namespace App\Controllers;

class Home extends BaseController
{
	public function index($appid)
	{
		$data['appid'] = $appid;
		echo view('templates/header');
		echo view('templates/body');
		echo view('templates/footer', $data);
	}

	//--------------------------------------------------------------------

}
